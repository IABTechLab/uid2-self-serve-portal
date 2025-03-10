import { Response } from 'express';

import { GetAuditTrail } from '../services/auditTrailService';
import { UserParticipantRequest } from '../services/participantsService';

export async function handleGetAuditTrail(req: UserParticipantRequest, res: Response) {
  const auditTrail = await GetAuditTrail();
  return res.status(200).json(auditTrail ?? []);
}
