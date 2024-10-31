import { Response } from 'express';

import { GetParticipantAuditTrail } from '../../services/auditTrailService';
import { UserParticipantRequest } from '../../services/participantsService';

export async function handleGetAuditTrail(req: UserParticipantRequest, res: Response) {
  const { participant } = req;
  const auditTrail = await GetParticipantAuditTrail(participant!);
  return res.status(200).json(auditTrail ?? []);
}
