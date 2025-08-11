import { AxiosError } from 'axios';
import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSharingList } from '../../services/adminServiceClient';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import {
  addSharingParticipants,
  deleteSharingParticipants,
  ParticipantRequest,
  UpdateSharingTypes,
  UserParticipantRequest,
} from '../../services/participantsService';

export const handleGetSharingPermission = async (req: ParticipantRequest, res: Response) => {
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
};

const sharingRelationSchema = z.object({
  newParticipantSites: z.array(z.number()),
});
export const handleAddSharingPermission = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { newParticipantSites } = sharingRelationSchema.parse(req.body);
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
    },
    participant!.id
  );

  const sharingParticipants = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => addSharingParticipants(participant.siteId!, newParticipantSites, traceId)
  );

  return res.status(200).json(sharingParticipants);
};

const removeSharingRelationSchema = z.object({
  sharingSitesToRemove: z.array(z.number()),
});
export const handleRemoveSharingPermission = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { sharingSitesToRemove } = removeSharingRelationSchema.parse(req.body);
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
    },
    participant!.id
  );

  const sharingParticipants = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => deleteSharingParticipants(participant.siteId!, sharingSitesToRemove, traceId)
  );

  return res.status(200).json(sharingParticipants);
};

export const ClientTypeEnum = z.enum(['DSP', 'ADVERTISER', 'DATA_PROVIDER', 'PUBLISHER']);

const sharingTypesSchema = z.object({
  types: z.array(ClientTypeEnum),
});
export const handleUpdateSharingTypes = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { types } = sharingTypesSchema.parse(req.body);
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
    },
    participant!.id
  );

  const sharingParticipants = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => UpdateSharingTypes(participant.siteId!, types, traceId)
  );

  return res.status(200).json(sharingParticipants);
};
