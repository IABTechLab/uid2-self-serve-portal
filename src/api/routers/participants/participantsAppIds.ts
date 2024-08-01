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

export async function getParticipantAppNames(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const participantSite = await getSite(participant.siteId);
  return res.status(200).json(participantSite.app_names ?? []);
}

const appNamesParser = z.object({ appNames: z.array(z.string()) });

export async function setParticipantAppNames(req: UserParticipantRequest, res: Response) {
  const { participant, user } = req;
  const { appNames } = appNamesParser.parse(req.body);
  const traceId = getTraceId(req);

  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const auditTrailInsertObject = constructAuditTrailObject(user!, AuditTrailEvents.UpdateAppNames, {
    action: AuditAction.Update,
    siteId: participant.siteId,
    appNames,
  });

  const updatedSite = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => setSiteAppNames(participant.siteId!, appNames)
  );

  return res.status(200).json(updatedSite.app_names);
}
