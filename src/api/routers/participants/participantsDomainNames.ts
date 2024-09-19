import { Response } from 'express';
import { z } from 'zod';

import { AuditAction, AuditTrailEvents } from '../../entities/AuditTrail';
import { siteIdNotSetError } from '../../helpers/errorHelpers';
import { getTraceId } from '../../helpers/loggingHelpers';
import { getSite, setSiteDomainNames } from '../../services/adminServiceClient';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from '../../services/auditTrailService';
import { ParticipantRequest, UserParticipantRequest } from '../../services/participantsService';

export async function handleGetParticipantDomainNames(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }
  const participantSite = await getSite(participant.siteId);
  return res.status(200).json(participantSite.domain_names ?? []);
}

const domainNamesSchema = z.object({ domainNames: z.array(z.string()) });
export async function handleSetParticipantDomainNames(req: UserParticipantRequest, res: Response) {
  const { participant, user } = req;
  const { domainNames } = domainNamesSchema.parse(req.body);
  const traceId = getTraceId(req);

  if (!participant?.siteId) {
    return siteIdNotSetError(req, res);
  }

  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.UpdateDomainNames,
    {
      action: AuditAction.Update,
      siteId: participant.siteId,
      domainNames,
    },
    participant.id
  );

  const updatedSite = await performAsyncOperationWithAuditTrail(
    auditTrailInsertObject,
    traceId,
    async () => setSiteDomainNames(participant.siteId!, domainNames)
  );

  return res.status(200).json(updatedSite.domain_names);
}
