import { AxiosError } from 'axios';
import express, { Response } from 'express';
import { z } from 'zod';

import { ApiRoleDTO } from '../../entities/ApiRole';
import { AuditAction } from '../../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantCreationPartial,
  ParticipantDTO,
  ParticipantStatus,
} from '../../entities/Participant';
import { ParticipantType } from '../../entities/ParticipantType';
import { UserDTO, UserRole } from '../../entities/User';
import { getTraceId } from '../../helpers/loggingHelpers';
import { mapClientTypeToParticipantType } from '../../helpers/siteConvertingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { isApproverCheck } from '../../middleware/approversMiddleware';
import {
  addKeyPair,
  createApiKey,
  disableApiKey,
  getApiKeysBySite,
  getSharingList,
  getSiteList,
  renameApiKey,
  setSiteClientTypes,
  updateApiKeyRoles,
} from '../../services/adminServiceClient';
import { AdminSiteDTO, mapAdminApiKeysToApiKeyDTOs } from '../../services/adminServiceHelpers';
import {
  createdApiKeyToApiKeySecrets,
  getApiKey,
  getApiRoles,
  validateApiRoles,
} from '../../services/apiKeyService';
import {
  insertApproveAccountAuditTrail,
  insertKeyPairAuditTrails,
  insertManageApiKeyAuditTrail,
  insertSharingAuditTrails,
  insertSharingTypesAuditTrail,
  updateAuditTrailToProceed,
} from '../../services/auditTrailService';
import {
  assignClientRoleToUser,
  createNewUser,
  sendInviteEmail,
} from '../../services/kcUsersService';
import {
  addSharingParticipants,
  checkParticipantId,
  deleteSharingParticipants,
  getParticipantsApproved,
  getParticipantsAwaitingApproval,
  ParticipantRequest,
  sendNewParticipantEmail,
  sendParticipantApprovedEmail,
  updateParticipantAndTypesAndRoles,
  updateParticipantApiRoles,
  UpdateSharingTypes,
} from '../../services/participantsService';
import {
  createUserInPortal,
  findUserByEmail,
  getAllUserFromParticipant,
} from '../../services/usersService';
import { createBusinessContactsRouter } from '../businessContactsRouter';
import { getParticipantKeyPairs } from './participantsKeyPairs';
import { getParticipantUsers } from './participantsUsers';

export type AvailableParticipantDTO = Required<Pick<ParticipantDTO, 'name' | 'siteId' | 'types'>>;

export type ParticipantRequestDTO = Pick<
  ParticipantDTO,
  'id' | 'name' | 'siteId' | 'types' | 'status' | 'apiRoles'
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
    apiRoles: participant.apiRoles,
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

  participantsRouter.get('/approved', isApproverCheck, async (req, res) => {
    const participants = await getParticipantsApproved();

    const sitesList = await getSiteList();
    const siteMap = new Map<number, AdminSiteDTO>(sitesList.map((s) => [s.id, s]));

    const allParticipantTypes = await ParticipantType.query();
    const result = participants
      .map((p) => {
        const currentSite = p?.siteId === undefined ? undefined : siteMap.get(p.siteId);
        return {
          ...p,
          types: mapClientTypeToParticipantType(
            currentSite?.clientTypes || [],
            allParticipantTypes
          ),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    return res.status(200).json(result);
  });

  participantsRouter.post('/', async (req, res) => {
    try {
      const traceId = getTraceId(req);
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
        data.types.map((t) => t.id),
        traceId
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
      const traceId = getTraceId(req);
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
      await updateParticipantAndTypesAndRoles(participant!, data);
      await sendParticipantApprovedEmail(users, traceId);
      await updateAuditTrailToProceed(auditTrail.id);
      return res.sendStatus(200);
    }
  );

  const updateParticipantParser = z.object({ apiRoles: z.array(z.number()) });

  participantsRouter.put(
    '/:participantId',
    isApproverCheck,
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;

      if (!participant) {
        return res.status(404).send('Unable to find participant');
      }

      const { apiRoles } = updateParticipantParser.parse(req.body);

      await updateParticipantApiRoles(participant, apiRoles);

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
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return res.status(400).send('Error inviting user');
        }
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

  participantsRouter.get(
    '/:participantId/apiKeys',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }

      const adminApiKeys = await getApiKeysBySite(participant.siteId);
      const apiKeys = await mapAdminApiKeysToApiKeyDTOs(adminApiKeys);

      return res.status(200).json(apiKeys);
    }
  );

  const apiKeyIdParser = z.object({
    keyId: z.string(),
  });
  participantsRouter.get(
    '/:participantId/apiKey',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }

      const { keyId } = apiKeyIdParser.parse(req.query);
      if (!keyId) {
        return res.status(400).send('Key id is not set');
      }

      const apiKey = await getApiKey(participant.siteId, keyId);
      if (!apiKey) {
        return res.status(404).send('Could not find participants key with keyId');
      }

      return res.status(200).json(apiKey);
    }
  );

  const apiKeyEditInputParser = z.object({
    keyId: z.string(),
    newName: z.string(),
    newApiRoles: z.array(z.string()),
  });
  participantsRouter.put(
    '/:participantId/apiKey',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }

      const { keyId, newName, newApiRoles } = apiKeyEditInputParser.parse(req.body);

      const editedKey = await getApiKey(participant.siteId, keyId);
      if (!editedKey) {
        return res.status(404).send('KeyId was invalid');
      }

      const traceId = getTraceId(req);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertManageApiKeyAuditTrail(
        participant!,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Update,
        editedKey.name,
        editedKey.roles.map((role) => role.roleName),
        traceId,
        editedKey.key_id,
        newName,
        newApiRoles
      );

      const participantRoles = await getApiRoles(participant);
      const validRoles = editedKey.roles.concat(participantRoles);
      if (!validateApiRoles(newApiRoles, validRoles)) {
        return res.status(401).send('API Permissions are invalid');
      }

      if (!newName) {
        return res.status(400).send('Name is invalid');
      }

      const apiKeyNameChanged = newName !== editedKey.name;
      if (apiKeyNameChanged) {
        await renameApiKey(editedKey.contact, newName);
      }

      const apiKeyRolesChanged =
        editedKey.roles
          .map((role) => role.roleName)
          .sort()
          .join(',') !== newApiRoles.sort().join(',');
      if (apiKeyRolesChanged) {
        await updateApiKeyRoles(editedKey.contact, newApiRoles);
      }

      await updateAuditTrailToProceed(auditTrail.id);

      return res.sendStatus(200);
    }
  );

  const apiKeyDeleteInputParser = z.object({
    keyId: z.string(),
  });
  participantsRouter.delete(
    '/:participantId/apiKey',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }

      const { keyId } = apiKeyDeleteInputParser.parse(req.body);

      const apiKey = await getApiKey(participant.siteId, keyId);
      if (!apiKey) {
        return res.status(404).send('KeyId was invalid');
      }

      const traceId = getTraceId(req);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertManageApiKeyAuditTrail(
        participant!,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Delete,
        apiKey.name,
        apiKey.roles.map((role) => role.roleName),
        traceId,
        apiKey.key_id
      );

      await disableApiKey(apiKey.contact);

      await updateAuditTrailToProceed(auditTrail.id);

      return res.sendStatus(200);
    }
  );

  participantsRouter.get(
    '/:participantId/apiRoles',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;

      const apiRoles: ApiRoleDTO[] = await getApiRoles(participant!);

      return res.status(200).json(apiRoles);
    }
  );

  const apiKeyCreateInputParser = z.object({ name: z.string(), roles: z.array(z.string()) });

  participantsRouter.post(
    '/:participantId/apiKey',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }

      const { name: keyName, roles: apiRoles } = apiKeyCreateInputParser.parse(req.body);

      const traceId = getTraceId(req);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertManageApiKeyAuditTrail(
        participant!,
        currentUser!.id,
        currentUser!.email,
        AuditAction.Add,
        keyName,
        apiRoles,
        traceId
      );

      if (!validateApiRoles(apiRoles, await getApiRoles(participant!))) {
        return res.status(400).send('Invalid API Permissions');
      }

      const key = await createApiKey(keyName, apiRoles, participant!.siteId);

      await updateAuditTrailToProceed(auditTrail.id);
      return res.status(200).json(createdApiKeyToApiKeySecrets(key));
    }
  );

  const sharingRelationParser = z.object({
    newParticipantSites: z.array(z.number()),
  });
  participantsRouter.post(
    '/:participantId/sharingPermission/add',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      const traceId = getTraceId(req);
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
        newParticipantSites,
        traceId
      );

      const sharingParticipants = await addSharingParticipants(
        participant.siteId,
        newParticipantSites,
        traceId
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
      const traceId = getTraceId(req);
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
        disabled,
        traceId
      );

      const keyPairs = await addKeyPair(participant.siteId, name, disabled);

      await updateAuditTrailToProceed(auditTrail.id);
      return res.status(201).json(keyPairs);
    }
  );

  participantsRouter.get('/:participantId/keyPairs', getParticipantKeyPairs);

  const removeSharingRelationParser = z.object({
    sharingSitesToRemove: z.array(z.number()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/delete',
    async (req: ParticipantRequest, res: Response) => {
      const { participant } = req;
      const traceId = getTraceId(req);
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
        sharingSitesToRemove,
        traceId
      );

      const sharingParticipants = await deleteSharingParticipants(
        participant.siteId,
        sharingSitesToRemove,
        traceId
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
      const traceId = getTraceId(req);
      if (!participant?.siteId) {
        return res.status(400).send('Site id is not set');
      }
      const { types } = sharingTypesParser.parse(req.body);
      const currentUser = await findUserByEmail(req.auth?.payload?.email as string);
      const auditTrail = await insertSharingTypesAuditTrail(
        participant,
        currentUser!.id,
        currentUser!.email,
        types,
        traceId
      );

      const sharingParticipants = await UpdateSharingTypes(participant.siteId, types, traceId);

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

  participantsRouter.get('/:participantId/users', getParticipantUsers);

  const businessContactsRouter = createBusinessContactsRouter();
  participantsRouter.use('/:participantId/businessContacts', businessContactsRouter);

  return { router: participantsRouter, businessContactsRouter };
}
