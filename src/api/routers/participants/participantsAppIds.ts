import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSite, setSiteAppNames } from '../../services/adminServiceClient';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export async function handleGetParticipantAppNames(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  const traceId = getTraceId(req);
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const participantSite = await getSite(participant.siteId, traceId);
  return res.status(200).json(participantSite.app_names ?? []);
}

const appNamesSchema = z.object({ appNames: z.array(z.string()) });
export async function handleSetParticipantAppNames(req: UserParticipantRequest, res: Response) {
  const { participant, user } = req;
  const { appNames } = appNamesSchema.parse(req.body);
  const traceId = getTraceId(req);

  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.UpdateAppNames,
    {
      action: AuditAction.Update,
      siteId: participant.siteId,
      appNames,
    },
    participant.id
  );

  const updatedSite = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => setSiteAppNames(participant.siteId!, appNames, traceId)
  );

  return res.status(200).json(updatedSite.app_names);
}
