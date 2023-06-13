import { SharingAction, SharingAuditTrail } from '../entities/SharingAuditTrail';
import { getLoggers } from '../helpers/loggingHelpers';

export const insertSharingAuditTrails = async (
  participantId: number,
  userId: number,
  action: SharingAction,
  siteIds: number[]
) => {
  try {
    const auditTrails = siteIds.map((siteId) => ({
      participantId,
      userId,
      sharingParticipantSiteId: siteId,
      action,
    }));

    await SharingAuditTrail.query().insert(auditTrails);
  } catch (error) {
    const [logger] = getLoggers();
    logger.error(`Audit trails upserted failed: ${error}`);
    throw error;
  }
};

export const getSharingAuditTrails = async (participantId: number, siteIds: number[]) => {
  return SharingAuditTrail.query()
    .where('participantId', participantId)
    .whereIn('sharingParticipantSiteId', siteIds);
};
