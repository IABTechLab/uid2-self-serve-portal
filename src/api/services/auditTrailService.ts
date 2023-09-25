import { z } from 'zod';

import {
  ApproveAccountEventData,
  AuditTrail,
  AuditTrailDTO,
  AuditTrailEvents,
  SharingAction,
} from '../entities/AuditTrail';
import { Participant, ParticipantApprovalPartial } from '../entities/Participant';
import { getLoggers } from '../helpers/loggingHelpers';
import { ClientType } from './adminServiceHelpers';
import { findUserByEmail } from './usersService';

const arraysHaveSameElements = (a: unknown[], b: unknown[]): boolean => {
  const aSet = new Set(a);
  const bSet = new Set(b);

  if (aSet.size !== bSet.size) return false;

  for (const elem of aSet) {
    if (!bSet.has(elem)) return false;
  }
  return true;
};

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

export const insertSharingTypesAuditTrail = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  types: ClientType[]
) => {
  try {
    const sharingAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      participantId: participant.id,
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateSharingTypes,
      eventData: {
        siteId: participant.siteId!,
        allowedTypes: types,
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

export const insertApproveAccountAuditTrail = async (
  participant: Participant,
  userEmail: string,
  data: z.infer<typeof ParticipantApprovalPartial>
) => {
  const user = await findUserByEmail(userEmail);
  const eventData: ApproveAccountEventData = {
    siteId: data.siteId!,
  };

  if (data.name !== participant.name) {
    eventData.newName = data.name;
    eventData.oldName = participant.name;
  }

  const oldTypeIds = participant.types!.map((type) => type.id);
  const newTypeIds = data.types.map((type) => type.id);

  if (!arraysHaveSameElements(oldTypeIds, newTypeIds)) {
    eventData.oldTypeIds = oldTypeIds;
    eventData.newTypeIds = newTypeIds;
  }

  return AuditTrail.query().insert({
    participantId: participant?.id!,
    userId: user?.id!,
    userEmail,
    event: AuditTrailEvents.ApproveAccount,
    eventData,
    succeeded: false,
  });
};

export const updateAuditTrailToProceed = async (id: number) => {
  return AuditTrail.query().patch({ succeeded: true }).where('id', id);
};
