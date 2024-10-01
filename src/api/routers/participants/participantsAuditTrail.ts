import { Response } from 'express';

import { GetParticipantAuditTrail } from '../../services/auditTrailService';
import { ParticipantRequest } from '../../services/participantsService';

export async function getParticipantAuditTrail(req: ParticipantRequest, res: Response) {
  const auditTrail = await GetParticipantAuditTrail(req.participant!);
  return res.status(200).json(auditTrail ?? []);
}
