import { Response } from 'express';
import { z } from 'zod';

import { AuditAction } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSite, setSiteAppNames } from '../../services/adminServiceClient';
import {
  insertAppNamesAuditTrails,
  updateAuditTrailToProceed,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export async function getParticipantAppIds(req: ParticipantRequest, res: Response) {
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
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const { appNames } = appNamesParser.parse(req.body);
  const traceId = getTraceId(req);
  const auditTrail = await insertAppNamesAuditTrails(
    participant,
    user!.id,
    user!.email,
    AuditAction.Update,
    appNames,
    traceId
  );

  const updatedSite = await setSiteAppNames(participant.siteId, appNames);

  await updateAuditTrailToProceed(auditTrail.id);
  return res.status(200).json(updatedSite.app_names);
}
