import { AuditTrail, AuditTrailDTO, AuditTrailEvents, SharingAction } from '../entities/AuditTrail';
import { Participant } from '../entities/Participant';
import { getLoggers } from '../helpers/loggingHelpers';

export const insertSharingAuditTrails = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  action: SharingAction,
  siteIds: number[]
) => {
  try {
    const sharingAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      participantId: participant.id,
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateSharingPermissions,
      eventData: {
        siteId: participant.siteId!,
        action,
        sharingPermissions: siteIds,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(sharingAuditTrail);
  } catch (error) {
    const [logger] = getLoggers();
    logger.error(`Audit trails inserted failed: ${error}`);
    throw error;
  }
};

export const updateAuditTrailToProceed = async (id: number) => {
  return AuditTrail.query().patch({ succeeded: true }).where('id', id);
};
