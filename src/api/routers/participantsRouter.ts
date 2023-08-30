import express, { Response } from 'express';
import { z } from 'zod';

import { SharingAction } from '../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantCreationPartial,
  ParticipantDTO,
  ParticipantSchema,
  ParticipantStatus,
} from '../entities/Participant';
import { UserRole } from '../entities/User';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isApproverCheck } from '../middleware/approversMiddleware';
import {
  insertApproveAccountAuditTrail,
  insertSharingAuditTrails,
  updateAuditTrailToProceed,
} from '../services/auditTrailService';
import { assignClientRoleToUser, createNewUser, sendInviteEmail } from '../services/kcUsersService';
import {
  addSharingParticipants,
  checkParticipantId,
  deleteSharingParticipants,
  getParticipantsAwaitingApproval,
  getSharedTypes,
  getSharingParticipants,
  ParticipantRequest,
  sendNewParticipantEmail,
  sendParticipantApprovedEmail,
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
>;

function mapParticipantToAvailableParticipant(participant: Participant) {
  return {
    id: participant.id,
    name: participant.name,
    siteId: participant.siteId,
    types: participant.types,
  };
}

export function createParticipantsRouter() {
  const participantsRouter = express.Router();

  participantsRouter.get('/available', async (_req, res) => {
    const participants = await Participant.query().whereNotNull('siteId').withGraphFetched('types');
    return res.status(200).json(participants.map(mapParticipantToAvailableParticipant));
  });

  participantsRouter.get(
    '/awaitingApproval',
    isApproverCheck,
    async (req: ParticipantRequest, res) => {
      const email = String(req.auth?.payload?.email);
      const participantsAwaitingApproval = await getParticipantsAwaitingApproval(email);
      return res.status(200).json(participantsAwaitingApproval);
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
      await Promise.all(
        users.map((user) =>
          assignClientRoleToUser(kcAdminClient, user.email, 'api-participant-member')
        )
      );
      await Participant.query().upsertGraph(
        {
          id: participant!.id!,
          ...data,
        },
        {
          relate: true,
        }
      );
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
      const sharingParticipants = await getSharingParticipants(participant.siteId);
      return res.status(200).json(sharingParticipants);
    }
  );

  participantsRouter.get(
    '/:participantId/sharedTypes',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const sharedTypes = await getSharedTypes(participant.siteId);
      return res.status(200).json(sharedTypes);
    }
  );

  const sharingRelationParser = z.object({
    newParticipantSites: z.array(z.number()),
    newTypes: z.array(z.string()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/add',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { newParticipantSites, newTypes } = sharingRelationParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingAuditTrails(
        participant,
        currentUser!.id,
        currentUser!.email,
        SharingAction.Add,
        newParticipantSites
      );

      const sharingParticipants = await addSharingParticipants(
        participant.siteId,
        newParticipantSites,
        newTypes
      );

      await updateAuditTrailToProceed(auditTrail.id);
      return res.status(200).json(sharingParticipants.map(mapParticipantToAvailableParticipant));
    }
  );

  const removeSharingRelationParser = z.object({
    sharingSitesToRemove: z.array(z.number()),
    types: z.array(z.string()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/delete',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { sharingSitesToRemove, types } = removeSharingRelationParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingAuditTrails(
        participant,
        currentUser!.id,
        currentUser!.email,
        SharingAction.Delete,
        sharingSitesToRemove
      );

      const sharingParticipants = await deleteSharingParticipants(
        participant.siteId,
        sharingSitesToRemove,
        types
      );

      await updateAuditTrailToProceed(auditTrail.id);

      return res.status(200).json(sharingParticipants.map(mapParticipantToAvailableParticipant));
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
