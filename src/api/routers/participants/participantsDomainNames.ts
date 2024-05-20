import { Response } from 'express';
import { z } from 'zod';

import { AuditAction } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSite, setSiteDomainNames } from '../../services/adminServiceClient';
import {
  insertDomainNamesAuditTrails,
  updateAuditTrailToProceed,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export async function getParticipantDomainNames(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const participantSite = await getSite(participant.siteId);
  return res.status(200).json(participantSite.domain_names ?? []);
}

const domainNamesParser = z.object({ domainNames: z.array(z.string()) });

export async function setParticipantDomainNames(req: UserParticipantRequest, res: Response) {
  const { participant, user } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const { domainNames } = domainNamesParser.parse(req.body);
  const traceId = getTraceId(req);
  const auditTrail = await insertDomainNamesAuditTrails(
    participant,
    user!.id,
    user!.email,
    AuditAction.Update,
    domainNames,
    traceId
  );

  const updatedSite = await setSiteDomainNames(participant.siteId, domainNames);

  await updateAuditTrailToProceed(auditTrail.id);
  return res.status(200).json(updatedSite.domain_names);
}
