import { Response } from 'express';

import { GetParticipantAuditTrail } from '../../services/auditTrailService';
import { UserParticipantRequest } from '../../services/participantsService';

export async function handleAuditTrail(req: UserParticipantRequest, res: Response) {
  const auditTrail = await GetParticipantAuditTrail(req.participant!);
  return res.status(200).json(auditTrail ?? []);
}
