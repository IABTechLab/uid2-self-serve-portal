import { AxiosError } from 'axios';
import express, { Response } from 'express';
import { z } from 'zod';

import { ApiRoleDTO } from '../../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantCreationPartial,
  ParticipantDTO,
  ParticipantStatus,
} from '../../entities/Participant';
import { UserDTO, UserJobFunction } from '../../entities/User';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getKcAdminClient } from '../../keycloakAdminClient';
import { isApproverCheck } from '../../middleware/approversMiddleware';
import { checkParticipantId } from '../../middleware/participantsMiddleware';
import { enrichCurrentUser } from '../../middleware/usersMiddleware';
import {
  addKeyPair,
  createApiKey,
  disableApiKey,
  getApiKeysBySite,
  getSharingList,
  renameApiKey,
  setSiteClientTypes,
  updateApiKeyRoles,
  updateKeyPair,
} from '../../services/adminServiceClient';
import {
  mapAdminApiKeysToApiKeyDTOs,
  ParticipantApprovalResponse,
} from '../../services/adminServiceHelpers';
import {
  createdApiKeyToApiKeySecrets,
  getApiKey,
  getApiRoles,
  validateApiRoles,
} from '../../services/apiKeyService';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import {
  assignClientRoleToUser,
  createNewUser,
  sendInviteEmail,
} from '../../services/kcUsersService';
import {
  addSharingParticipants,
  deleteSharingParticipants,
  getParticipantsApproved,
  getParticipantsAwaitingApproval,
  ParticipantRequest,
  sendNewParticipantEmail,
  sendParticipantApprovedEmail,
  updateParticipant,
  updateParticipantAndTypesAndRoles,
  UpdateSharingTypes,
  UserParticipantRequest,
} from '../../services/participantsService';
import { getSignedParticipants } from '../../services/signedParticipantsService';
import {
  createUserInPortal,
  findUserByEmail,
  getAllUserFromParticipant,
} from '../../services/usersService';
import { createBusinessContactsRouter } from '../businessContactsRouter';
import { getParticipantAppNames, setParticipantAppNames } from './participantsAppIds';
import { createParticipant } from './participantsCreation';
import { getParticipantDomainNames, setParticipantDomainNames } from './participantsDomainNames';
import { getParticipantKeyPairs } from './participantsKeyPairs';
import { getParticipantUsers } from './participantsUsers';

export type AvailableParticipantDTO = Required<Pick<ParticipantDTO, 'name' | 'siteId' | 'types'>>;

export type ParticipantRequestDTO = Pick<
  ParticipantDTO,
  'id' | 'name' | 'siteId' | 'types' | 'status' | 'apiRoles'
> & {
  requestingUser: Pick<UserDTO, 'email'> &
    Partial<Pick<UserDTO, 'jobFunction'>> & { fullName: string };
};

export const ClientTypeEnum = z.enum(['DSP', 'ADVERTISER', 'DATA_PROVIDER', 'PUBLISHER']);

function mapParticipantToApprovalRequest(participant: Participant): ParticipantRequestDTO {
  // There should usually only be one user at this point - but if there are multiple, the first one is preferred.
  const firstUser = participant.users?.sort((a, b) => a.id - b.id)[0];
  return {
    id: participant.id,
    name: participant.name,
    siteId: participant.siteId,
    types: participant.types,
    apiRoles: participant.apiRoles,
    status: participant.status,
    requestingUser: {
      email: firstUser ? firstUser.email : '',
      jobFunction: firstUser?.jobFunction,
      fullName: firstUser
        ? firstUser?.fullName()
        : 'There is no user attached to this participant.',
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
    const result = participants.sort((a, b) => a.name.localeCompare(b.name));
    return res.status(200).json(result);
  });

  participantsRouter.get('/signed', async (_req, res) => {
    const signedParticipants = await getSignedParticipants();
    const result = signedParticipants.sort((a, b) => a.name.localeCompare(b.name));
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

  participantsRouter.use('/:participantId', enrichCurrentUser);

  participantsRouter.put(
    '/:participantId/approve',
    isApproverCheck,
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const traceId = getTraceId(req);
      const data = {
        ...ParticipantApprovalPartial.parse(req.body),
        status: ParticipantStatus.Approved,
        approverId: user?.id,
        dateApproved: new Date(),
      };

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ApproveAccount,
        {
          oldName: participant?.name,
          siteId: data.siteId!,
          newName: data.name,
          oldTypeIds: participant?.types!.map((type) => type.id),
          newTypeIds: data.types.map((type) => type.id),
          apiRoles: data.apiRoles.map((role) => role.id),
        }
      );

      const users = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => {
          const kcAdminClient = await getKcAdminClient();
          const usersFromParticipant = await getAllUserFromParticipant(participant!);
          // if there are no users, send email to the approver
          const emailRecipient = usersFromParticipant.length > 0 ? usersFromParticipant : [user!];
          await setSiteClientTypes(data);
          await Promise.all(
            usersFromParticipant.map((currentUser) =>
              assignClientRoleToUser(kcAdminClient, currentUser.email, 'api-participant-member')
            )
          );

          await updateParticipantAndTypesAndRoles(participant!, data);
          await sendParticipantApprovedEmail(emailRecipient, traceId);

          return usersFromParticipant;
        }
      );

      const approvalResponse: ParticipantApprovalResponse = {
        users,
      };

      return res.status(200).json(approvalResponse);
    }
  );

  participantsRouter.put(
    '/:participantId',
    isApproverCheck,
    async (req: UserParticipantRequest, res: Response) => {
      const { participant } = req;

      if (!participant) {
        return res.status(404).send('Unable to find participant');
      }

      await updateParticipant(participant, req);

      return res.sendStatus(200);
    }
  );

  participantsRouter.put('/', createParticipant);

  participantsRouter.use('/:participantId', checkParticipantId);

  const invitationParser = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    jobFunction: z.nativeEnum(UserJobFunction),
  });

  participantsRouter.post(
    '/:participantId/invite',
    async (req: UserParticipantRequest, res: Response) => {
      try {
        const { participant, user } = req;
        const { firstName, lastName, email, jobFunction } = invitationParser.parse(req.body);
        const traceId = getTraceId(req);
        // TODO: UID2-3878 - support user belonging to multiple participants by not 400ing here if the user already exists.
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return res.status(400).send('Error inviting user');
        }
        const kcAdminClient = await getKcAdminClient();
        const auditTrailInsertObject = constructAuditTrailObject(
          user!,
          AuditTrailEvents.ManageTeamMembers,
          {
            action: AuditAction.Add,
            firstName,
            lastName,
            email,
            jobFunction,
          }
        );

        await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
          const newUser = await createNewUser(kcAdminClient, firstName, lastName, email);
          await createUserInPortal(
            {
              email,
              jobFunction,
              firstName,
              lastName,
            },
            participant!.id
          );
          await sendInviteEmail(kcAdminClient, newUser);
        });

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
        return siteIdNotSetError(req, res);
      }
      const traceId = getTraceId(req);
      try {
        const sharingList = await getSharingList(participant.siteId, traceId);
        return res.status(200).json(sharingList);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          return res
            .status(404)
            .send({ message: 'This site does not have a keyset.', missingKeyset: true });
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
        return siteIdNotSetError(req, res);
      }

      const adminApiKeys = await getApiKeysBySite(participant.siteId);
      const enabledAdminApiKeys = adminApiKeys.filter((key) => !key.disabled);
      const apiKeys = await mapAdminApiKeysToApiKeyDTOs(enabledAdminApiKeys);

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
        return siteIdNotSetError(req, res);
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
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const { keyId, newName, newApiRoles } = apiKeyEditInputParser.parse(req.body);

      const editedKey = await getApiKey(participant.siteId, keyId);
      if (!editedKey) {
        return res.status(404).send('SiteId was invalid');
      }

      const traceId = getTraceId(req);
      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageApiKey,
        {
          action: AuditAction.Update,
          siteId: participant.siteId,
          keyId: editedKey.key_id,
          keyName: editedKey.name,
          newKeyName: newName,
          apiRoles: editedKey.roles.map((role) => role.roleName),
          newApiRoles,
        }
      );

      await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
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
      });
      return res.sendStatus(200);
    }
  );

  const apiKeyDeleteInputParser = z.object({
    keyId: z.string(),
  });
  participantsRouter.delete(
    '/:participantId/apiKey',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { keyId } = apiKeyDeleteInputParser.parse(req.body);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }
      const apiKey = await getApiKey(participant.siteId, keyId);
      if (!apiKey) {
        return res.status(404).send('SiteId was invalid');
      }

      const traceId = getTraceId(req);
      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageApiKey,
        {
          action: AuditAction.Delete,
          siteId: participant.siteId,
          keyName: apiKey.name,
          apiRoles: apiKey.roles.map((role) => role.roleName),
          keyId: apiKey.key_id,
        }
      );

      await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () =>
        disableApiKey(apiKey.contact)
      );

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
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { name: keyName, roles: apiRoles } = apiKeyCreateInputParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }
      if (!validateApiRoles(apiRoles, await getApiRoles(participant))) {
        return res.status(400).send('Invalid API Permissions');
      }

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageApiKey,
        {
          action: AuditAction.Add,
          siteId: participant.siteId,
          keyName,
          apiRoles,
        }
      );

      const key = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => {
          return createApiKey(keyName, apiRoles, participant.siteId!);
        }
      );

      return res.status(200).json(createdApiKeyToApiKeySecrets(key));
    }
  );

  const sharingRelationParser = z.object({
    newParticipantSites: z.array(z.number()),
  });
  participantsRouter.post(
    '/:participantId/sharingPermission/add',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { newParticipantSites } = sharingRelationParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.UpdateSharingPermissions,
        {
          action: AuditAction.Add,
          sharingPermissions: newParticipantSites,
          siteId: participant.siteId,
        }
      );

      const sharingParticipants = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => addSharingParticipants(participant.siteId!, newParticipantSites, traceId)
      );

      return res.status(200).json(sharingParticipants);
    }
  );

  const keyPairParser = z.object({
    name: z.string(),
    disabled: z.boolean(),
    subscriptionId: z.string(),
  });

  const addKeyPairParser = z.object({
    name: z.string(),
  });

  participantsRouter.post(
    '/:participantId/keyPair/add',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { name } = addKeyPairParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const disabled = false;
      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageKeyPair,
        {
          action: AuditAction.Add,
          siteId: participant.siteId,
          name,
          disabled,
        }
      );

      const keyPairs = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => addKeyPair(participant.siteId!, name)
      );

      return res.status(201).json(keyPairs);
    }
  );

  participantsRouter.post(
    '/:participantId/keyPair/update',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { name, subscriptionId, disabled } = keyPairParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageKeyPair,
        {
          action: AuditAction.Update,
          siteId: participant.siteId,
          name,
          disabled,
        }
      );

      const updatedKeyPair = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => updateKeyPair(subscriptionId, name)
      );

      return res.status(201).json(updatedKeyPair);
    }
  );

  participantsRouter.delete(
    '/:participantId/keyPair',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { name, subscriptionId } = keyPairParser.parse(req.body.keyPair);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const disabledDate = new Date().toISOString();
      const disabledKeyPairName = `${name}-disabled-${disabledDate}`;
      const disabled = true;

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.ManageKeyPair,
        {
          action: AuditAction.Delete,
          siteId: participant.siteId,
          name,
          disabled,
        }
      );

      await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () =>
        updateKeyPair(subscriptionId, disabledKeyPairName, disabled)
      );

      return res.sendStatus(200);
    }
  );

  participantsRouter.get('/:participantId/keyPairs', getParticipantKeyPairs);

  participantsRouter.get('/:participantId/domainNames', getParticipantDomainNames);

  participantsRouter.post('/:participantId/domainNames', setParticipantDomainNames);

  participantsRouter.get('/:participantId/appNames', getParticipantAppNames);

  participantsRouter.post('/:participantId/appNames', setParticipantAppNames);

  const removeSharingRelationParser = z.object({
    sharingSitesToRemove: z.array(z.number()),
  });

  participantsRouter.post(
    '/:participantId/sharingPermission/delete',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { sharingSitesToRemove } = removeSharingRelationParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.UpdateSharingPermissions,
        {
          action: AuditAction.Delete,
          sharingPermissions: sharingSitesToRemove,
          siteId: participant.siteId,
        }
      );

      const sharingParticipants = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => deleteSharingParticipants(participant.siteId!, sharingSitesToRemove, traceId)
      );

      return res.status(200).json(sharingParticipants);
    }
  );

  const sharingTypesParser = z.object({
    types: z.array(ClientTypeEnum),
  });
  participantsRouter.post(
    '/:participantId/sharingPermission/shareWithTypes',
    async (req: UserParticipantRequest, res: Response) => {
      const { participant, user } = req;
      const { types } = sharingTypesParser.parse(req.body);
      const traceId = getTraceId(req);

      if (!participant?.siteId) {
        return siteIdNotSetError(req, res);
      }

      const auditTrailInsertObject = constructAuditTrailObject(
        user!,
        AuditTrailEvents.UpdateSharingTypes,
        {
          siteId: participant.siteId,
          allowedTypes: types,
        }
      );

      const sharingParticipants = await performAsyncOperationWithAuditTrail(
        auditTrailInsertObject,
        traceId,
        async () => UpdateSharingTypes(participant.siteId!, types, traceId)
      );

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
