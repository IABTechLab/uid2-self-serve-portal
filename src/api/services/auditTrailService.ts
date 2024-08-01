import { AuditTrail, AuditTrailDTO, AuditTrailEvents } from '../entities/AuditTrail';
import { User } from '../entities/User';
import { getLoggers } from '../helpers/loggingHelpers';

export type InsertAuditTrailDTO = Omit<AuditTrailDTO, 'id' | 'succeeded'>;

export const constructAuditTrailObject = (
  user: User,
  event: AuditTrailEvents,
  eventData: unknown
): InsertAuditTrailDTO => {
  // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
  const currentParticipant = user.participants?.[0];
  return {
    userId: user.id,
    userEmail: user.email,
    participantId: currentParticipant?.id,
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
