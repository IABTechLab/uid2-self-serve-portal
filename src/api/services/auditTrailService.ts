import { z } from 'zod';

import {
  ApproveAccountEventData,
  AuditAction,
  AuditTrail,
  AuditTrailDTO,
  AuditTrailEvents,
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
  action: AuditAction,
  siteIds: number[],
  traceId: string
) => {
  try {
    const sharingAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateSharingPermissions,
      eventData: {
        siteId: participant.siteId!,
        action,
        sharingPermissions: siteIds,
        participantId: participant.id,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(sharingAuditTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
    throw error;
  }
};

export const insertManageApiKeyAuditTrail = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  action: AuditAction,
  keyName: String,
  apiRoles: String[],
  traceId: string,
  keyId?: String,
  newKeyName?: String,
  newApiRoles?: String[]
) => {
  try {
    const manageApiKeyTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.ManageApiKey,
      eventData: {
        siteId: participant.siteId!,
        action,
        apiRoles,
        keyName,
        participantId: participant.id,
        keyId,
        newKeyName,
        newApiRoles,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(manageApiKeyTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
    throw error;
  }
};

export const insertSharingTypesAuditTrail = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  types: ClientType[],
  traceId: string
) => {
  try {
    const sharingAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateSharingTypes,
      eventData: {
        siteId: participant.siteId!,
        allowedTypes: types,
        participantId: participant.id,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(sharingAuditTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
    throw error;
  }
};

export const insertKeyPairAuditTrails = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  action: AuditAction,
  name: string,
  disabled: boolean,
  traceId: string
) => {
  try {
    const keyPairAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.ManageKeyPair,
      eventData: {
        siteId: participant.siteId!,
        action,
        name,
        disabled,
        participantId: participant.id,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(keyPairAuditTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
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
    apiRoles: data.apiRoles.map((role) => role.id),
    participantId: participant.id,
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
