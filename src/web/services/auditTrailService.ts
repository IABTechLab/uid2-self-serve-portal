import axios from 'axios';

import { AuditTrailDTO } from '../../api/entities/AuditTrail';
import { backendError } from '../utils/apiError';

export async function GetAuditLogs(participantId: number) {
  try {
    const result = await axios.get<AuditTrailDTO[]>(`/participants/${participantId}/auditTrail`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get audit trail.');
  }
}
