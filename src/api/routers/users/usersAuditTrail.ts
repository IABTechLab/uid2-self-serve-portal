import { Response } from 'express';

import { GetUserAuditTrail } from '../../services/auditTrailService';
import { UserParticipantRequest } from '../../services/participantsService';

export async function handleGetUserAuditTrail(req: UserParticipantRequest, res: Response) {
  const { user } = req;
  const auditTrail = await GetUserAuditTrail(user!);
  return res.status(200).json(auditTrail ?? []);
}
