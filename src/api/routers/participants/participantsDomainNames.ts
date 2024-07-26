import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSite, setSiteDomainNames } from '../../services/adminServiceClient';
import {
  InsertAuditTrailDTO, performAsyncOperationWithAuditTrail
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
  const { domainNames } = domainNamesParser.parse(req.body);
  const traceId = getTraceId(req);

  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }

  const auditTrailInsertObject: InsertAuditTrailDTO = {
    userId: user!.id,
    userEmail: user!.email,
    participantId: participant.id,
    event: AuditTrailEvents.UpdateDomainNames,
    eventData: {
      action: AuditAction.Update,
      siteId: participant.siteId,
      domainNames,
    },
  };

  const updatedSite = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => setSiteDomainNames(participant.siteId!, domainNames)
  );

  return res.status(200).json(updatedSite.domain_names);
}
