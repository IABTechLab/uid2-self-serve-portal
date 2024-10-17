import { AuditTrail, AuditTrailDTO, AuditTrailEvents } from '../entities/AuditTrail';
import { Participant } from '../entities/Participant';
import { User } from '../entities/User';
import { getLoggers } from '../helpers/loggingHelpers';

export type InsertAuditTrailDTO = Omit<AuditTrailDTO, 'id' | 'succeeded' | 'updated_at'>;

export const constructAuditTrailObject = (
  user: User,
  event: AuditTrailEvents,
  eventData: unknown,
  participantId: number | null = null
): InsertAuditTrailDTO => {
  return {
    userId: user.id,
    userEmail: user.email,
    participantId,
    event,
    eventData,
  };
};

export const performAsyncOperationWithAuditTrail = async <T>(
  auditTrail: InsertAuditTrailDTO,
  traceId: string,
  operation: () => Promise<T>
) => {
  const insertedAuditTrail = await AuditTrail.query().insert({ ...auditTrail, succeeded: false });
  try {
    const result = await operation();
    await AuditTrail.query().patch({ succeeded: true }).where('id', insertedAuditTrail.id);
    return result;
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`${auditTrail.event} failed with error: ${error}`, traceId);
    throw error;
  }
};

export const GetParticipantAuditTrail = async (participant: Participant) => {
  const auditTrail = await AuditTrail.query().where('participantId', participant.id);
  return auditTrail;
};
