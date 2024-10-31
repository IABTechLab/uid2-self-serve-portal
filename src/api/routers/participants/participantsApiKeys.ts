import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import {
  createApiKey,
  disableApiKey,
  getApiKeysBySite,
  renameApiKey,
  updateApiKeyRoles,
} from '../../services/adminServiceClient';
import { mapAdminApiKeysToApiKeyDTOs } from '../../services/adminServiceHelpers';
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
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export const handleGetParticipantApiKeys = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }

  const adminApiKeys = await getApiKeysBySite(participant.siteId);
  const enabledAdminApiKeys = adminApiKeys.filter((key) => !key.disabled);
  const apiKeys = await mapAdminApiKeysToApiKeyDTOs(enabledAdminApiKeys);

  return res.status(200).json(apiKeys);
};

const apiKeyIdSchema = z.object({
  keyId: z.string(),
});
export const handleGetParticipantApiKey = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }

  const { keyId } = apiKeyIdSchema.parse(req.query);
  if (!keyId) {
    return res.status(400).send('Key id is not set');
  }

  const apiKey = await getApiKey(participant.siteId, keyId);
  if (!apiKey) {
    return res.status(404).send('Could not find participants key with keyId');
  }

  return res.status(200).json(apiKey);
};

const apiKeyCreateInputSchema = z.object({ name: z.string(), roles: z.array(z.string()) });
export const handleAddApiKey = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { name: keyName, roles: apiRoles } = apiKeyCreateInputSchema.parse(req.body);
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
    },
    participant!.id
  );

  const key = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => {
      return createApiKey(keyName, apiRoles, participant.siteId!);
    }
  );

  return res.status(200).json(createdApiKeyToApiKeySecrets(key));
};

const apiKeyEditInputSchema = z.object({
  keyId: z.string(),
  newName: z.string(),
  newApiRoles: z.array(z.string()),
});
export const handleUpdateApiKey = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }

  const { keyId, newName, newApiRoles } = apiKeyEditInputSchema.parse(req.body);

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
    },
    participant!.id
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
};

const apiKeyDeleteInputSchema = z.object({
  keyId: z.string(),
});
export const handleDeleteApiKey = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { keyId } = apiKeyDeleteInputSchema.parse(req.body);

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
    },
    participant!.id
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () =>
    disableApiKey(apiKey.contact)
  );

  return res.sendStatus(200);
};
