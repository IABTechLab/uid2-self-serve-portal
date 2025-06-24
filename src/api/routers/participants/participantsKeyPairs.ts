import { jest } from "@jest/globals";
import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { addKeyPair, getKeyPairsList, updateKeyPair } from '../../services/adminServiceClient';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export const handleGetParticipantKeyPairs = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const siteId = participant?.siteId;
  const traceId = getTraceId(req);
  const allKeyPairs = await getKeyPairsList(siteId, traceId);
  return res.status(200).json(allKeyPairs);
};

const keyPairSchema = z.object({
  name: z.string(),
  disabled: z.boolean(),
  subscriptionId: z.string(),
});
const addKeyPairSchema = z.object({
  name: z.string(),
});
export const handleAddKeyPair = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { name } = addKeyPairSchema.parse(req.body);
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
    },
    participant!.id
  );

  const keyPairs = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => addKeyPair(participant.siteId!, name, traceId)
  );

  return res.status(201).json(keyPairs);
};

export const handleUpdateKeyPair = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { name, subscriptionId, disabled } = keyPairSchema.parse(req.body);
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
    },
    participant!.id
  );

  const updatedKeyPair = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => updateKeyPair(subscriptionId, name, traceId, disabled)
  );

  return res.status(201).json(updatedKeyPair);
};

export const handleDeleteKeyPair = async (req: UserParticipantRequest, res: Response) => {
  const { participant, user } = req;
  const { name, subscriptionId } = keyPairSchema.parse(req.body.keyPair);
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
    },
    participant!.id
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () =>
    updateKeyPair(subscriptionId, disabledKeyPairName, traceId)
  );

  return res.sendStatus(200);
};
