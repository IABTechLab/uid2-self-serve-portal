import { AxiosError } from 'axios';
import express, { Response } from 'express';
import { z } from 'zod';

import { AuditAction } from '../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantCreationPartial,
  ParticipantDTO,
  ParticipantSchema,
  ParticipantStatus,
} from '../entities/Participant';
import { UserDTO, UserRole } from '../entities/User';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isApproverCheck } from '../middleware/approversMiddleware';
import {
  addKeyPair,
  getKeyPairsList,
  getSharingList,
  setSiteClientTypes,
} from '../services/adminServiceClient';
import {
  insertApproveAccountAuditTrail,
  insertKeyPairAuditTrails,
  insertSharingAuditTrails,
  insertSharingTypesAuditTrail,
  updateAuditTrailToProceed,
} from '../services/auditTrailService';
import { assignClientRoleToUser, createNewUser, sendInviteEmail } from '../services/kcUsersService';
import {
  addSharingParticipants,
  checkParticipantId,
  deleteSharingParticipants,
  getParticipantsAwaitingApproval,
  ParticipantRequest,
  sendNewParticipantEmail,
  sendParticipantApprovedEmail,
  updateParticipantAndTypes,
  UpdateSharingTypes,
} from '../services/participantsService';
import {
  createUserInPortal,
  findUserByEmail,
  getAllUserFromParticipant,
} from '../services/usersService';
import { createBusinessContactsRouter } from './businessContactsRouter';

export type AvailableParticipantDTO = Required<Pick<ParticipantDTO, 'name' | 'siteId' | 'types'>>;

export type ParticipantRequestDTO = Pick<
  ParticipantDTO,
  'id' | 'name' | 'siteId' | 'types' | 'status'
> & {
  requestingUser: Pick<UserDTO, 'email' | 'role'> & { fullName: string };
};

export const ClientTypeEnum = z.enum(['DSP', 'ADVERTISER', 'DATA_PROVIDER', 'PUBLISHER']);

function mapParticipantToApprovalRequest(participant: Participant): ParticipantRequestDTO {
  if (!participant.users || participant.users.length === 0)
    throw Error('Found a participant with no requesting user.');

  // There should usually only be one user at this point - but if there are multiple, the first one is preferred.
  const firstUser = participant.users.sort((a, b) => a.id - b.id)[0];
  return {
    id: participant.id,
    name: participant.name,
    siteId: participant.siteId,
    types: participant.types,
    status: participant.status,
    requestingUser: {
      email: firstUser.email,
      role: firstUser.role,
      fullName: firstUser.fullName(),
    },
  };
}

export function createParticipantsRouter() {
  const participantsRouter = express.Router();

  participantsRouter.get(
    '/awaitingApproval',
    isApproverCheck,
    async (req: ParticipantRequest, res) => {
      const email = String(req.auth?.payload?.email);
      const participantsAwaitingApproval = await getParticipantsAwaitingApproval(email);
      const result: ParticipantRequestDTO[] = participantsAwaitingApproval.map(
        mapParticipantToApprovalRequest
      );
      return res.status(200).json(result);
    }
  );

  participantsRouter.post('/', async (req, res) => {
    try {
      const data = {
        ...ParticipantCreationPartial.parse(req.body),
        status: ParticipantStatus.AwaitingApproval,
      };
      // insertGraphAndFetch will implicitly create a transaction
      const newParticipant = await Participant.query().insertGraphAndFetch([data], {
        relate: true,
      });

      sendNewParticipantEmail(
        data,
        data.types.map((t) => t.id)
      );
      return res.status(201).json(newParticipant);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
      return res.status(400).send([{ message: 'Unable to create participant' }]);
    }
  });

  participantsRouter.put(
    '/:participantId/approve',
    isApproverCheck,
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      const data = {
        ...ParticipantApprovalPartial.parse(req.body),
        status: ParticipantStatus.Approved,
      };

      const auditTrail = await insertApproveAccountAuditTrail(
        participant!,
        req.auth?.payload?.email as string,
        data
      );
      const kcAdminClient = await getKcAdminClient();
      const users = await getAllUserFromParticipant(participant!);
      await setSiteClientTypes(data);
      await Promise.all(
        users.map((user) =>
          assignClientRoleToUser(kcAdminClient, user.email, 'api-participant-member')
        )
      );
      await updateParticipantAndTypes(participant!, data);
      await sendParticipantApprovedEmail(users);
      await updateAuditTrailToProceed(auditTrail.id);
      return res.sendStatus(200);
    }
  );

  participantsRouter.use('/:participantId', checkParticipantId);

  const invitationParser = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.nativeEnum(UserRole),
  });

  participantsRouter.post(
    '/:participantId/invite',
    async (req: ParticipantRequest, res: Response) => {
      try {
        const { participant } = req;
        const { firstName, lastName, email, role } = invitationParser.parse(req.body);
        const kcAdminClient = await getKcAdminClient();
        const user = await createNewUser(kcAdminClient, firstName, lastName, email);
        await createUserInPortal({
          email,
          role,
          participantId: participant!.id,
          firstName,
          lastName,
        });
        await sendInviteEmail(kcAdminClient, user);
        return res.sendStatus(201);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).send(err.issues);
        }
        throw err;
      }
    }
  );

  const participantParser = ParticipantSchema.pick({
    location: true,
  });

  participantsRouter.put('/:participantId', async (req: ParticipantRequest, res: Response) => {
    try {
      const { location } = participantParser.parse(req.body);

      const { participant } = req;
      await participant!.$query().patch({ location });
      return res.status(200).json(participant);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send(err.issues);
      }
      throw err;
    }
  });

  participantsRouter.get(
    '/:participantId/sharingPermission',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      try {
        const sharingList = await getSharingList(participant.siteId);
        return res.status(200).json(sharingList);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          return res.status(404).send('This site does not have a keyset.');
        }
        throw err;
      }
    }
  );

  const sharingRelationParser = z.object({
    newParticipantSites: z.array(z.number()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/add',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { newParticipantSites } = sharingRelationParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingAuditTrails(
        participant,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Add,
        newParticipantSites
      );

      const sharingParticipants = await addSharingParticipants(
        participant.siteId,
        newParticipantSites
      );

      await updateAuditTrailToProceed(auditTrail.id);
      return res.status(200).json(sharingParticipants);
    }
  );

  const keyPairParser = z.object({
    name: z.string(),
    disabled: z.boolean(),
  });

  participantsRouter.post(
    '/:participantId/keyPair/add',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { name, disabled } = keyPairParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertKeyPairAuditTrails(
        participant,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Add,
        name,
        disabled
      );

      const keyPairs = await addKeyPair(participant.siteId, name, disabled);

      await updateAuditTrailToProceed(auditTrail.id);
      return res.status(201).json(keyPairs);
    }
  );

  participantsRouter.get(
    '/:participantId/keyPairs',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const siteId = participant?.siteId;
      const allKeyPairs = await getKeyPairsList(siteId!);
      return res.status(200).json(allKeyPairs);
    }
  );

  const removeSharingRelationParser = z.object({
    sharingSitesToRemove: z.array(z.number()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/delete',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { sharingSitesToRemove } = removeSharingRelationParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingAuditTrails(
        participant,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Delete,
        sharingSitesToRemove
      );

      const sharingParticipants = await deleteSharingParticipants(
        participant.siteId,
        sharingSitesToRemove
      );

      await updateAuditTrailToProceed(auditTrail.id);

      return res.status(200).json(sharingParticipants);
    }
  );

  const sharingTypesParser = z.object({
    types: z.array(ClientTypeEnum),
  });
  participantsRouter.post(
    '/:participantId/sharingPermission/shareWithTypes',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { types } = sharingTypesParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingTypesAuditTrail(
        participant,
        currentUser!.id,
        currentUser!.email,
        types
      );

      const sharingParticipants = await UpdateSharingTypes(participant.siteId, types);

      await updateAuditTrailToProceed(auditTrail.id);

      return res.status(200).json(sharingParticipants);
    }
  );

  participantsRouter.put(
    '/:participantId/completeRecommendations',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      const updatedParticipant = await Participant.query()
        .patchAndFetchById(participant!.id, {
          completedRecommendations: true,
        })
        .withGraphFetched('types');
      return res.status(200).json(updatedParticipant);
    }
  );

  participantsRouter.get(
    '/:participantId/users',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      const users = await getAllUserFromParticipant(participant!);
      return res.status(200).json(users);
    }
  );

  const businessContactsRouter = createBusinessContactsRouter();
  participantsRouter.use('/:participantId/businessContacts', businessContactsRouter);

  return { router: participantsRouter, businessContactsRouter };
}
