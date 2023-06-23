import { SharingAction, SharingAuditTrail } from '../entities/SharingAuditTrail';
import { getLoggers } from '../helpers/loggingHelpers';

export const insertSharingAuditTrails = async (
  participantId: number,
  userId: number,
  userEmail: string,
  action: SharingAction,
  siteIds: number[]
) => {
  try {
    const auditTrails = siteIds.map((siteId) => ({
      participantId,
      userId,
      userEmail,
      sharingParticipantSiteId: siteId,
      action,
    }));

    return await SharingAuditTrail.query().insert(auditTrails);
  } catch (error) {
    const [logger] = getLoggers();
    logger.error(`Audit trails inserted failed: ${error}`);
    throw error;
  }
};

export const getSharingAuditTrails = async (participantId: number, siteIds: number[]) => {
  return SharingAuditTrail.query()
    .where('participantId', participantId)
    .whereIn('sharingParticipantSiteId', siteIds);
};

export const updateAuditTrailsToProceed = async (ids: number[]) => {
  return SharingAuditTrail.query().patch({ proceed: true }).whereIn('id', ids);
};
