import { z } from 'zod';

import {
  AddParticipantEventData,
  ApproveAccountEventData,
  AuditAction,
  AuditTrail,
  AuditTrailDTO,
  AuditTrailEvents,
} from '../entities/AuditTrail';
import { Participant, ParticipantApprovalPartial } from '../entities/Participant';
import { User } from '../entities/User';
import { getLoggers } from '../helpers/loggingHelpers';
import { ParticipantCreationAndApprovalPartial } from '../routers/participants/participantClasses';
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
  keyName: string,
  apiRoles: string[],
  traceId: string,
  keyId?: string,
  newKeyName?: string,
  newApiRoles?: string[]
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

export const insertDomainNamesAuditTrails = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  action: AuditAction,
  domainNames: string[],
  traceId: string
) => {
  try {
    const domainNamesAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateDomainNames,
      eventData: {
        siteId: participant.siteId!,
        action,
        participantId: participant.id,
        domainNames,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(domainNamesAuditTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
    throw error;
  }
};

export const insertAppNamesAuditTrails = async (
  participant: Participant,
  userId: number,
  userEmail: string,
  action: AuditAction,
  appNames: string[],
  traceId: string
) => {
  try {
    const appNamesAuditTrail: Omit<AuditTrailDTO, 'id'> = {
      userId,
      userEmail,
      event: AuditTrailEvents.UpdateDomainNames,
      eventData: {
        siteId: participant.siteId!,
        action,
        participantId: participant.id,
        appNames,
      },
      succeeded: false,
    };

    return await AuditTrail.query().insert(appNamesAuditTrail);
  } catch (error) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Audit trails inserted failed: ${error}`, traceId);
    throw error;
  }
};

export const insertApproveAccountAuditTrail = async (
  participant: Participant,
  user: User,
  data: z.infer<typeof ParticipantApprovalPartial>
) => {
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
    userId: user?.id,
    userEmail: user.email,
    event: AuditTrailEvents.ApproveAccount,
    eventData,
    succeeded: false,
  });
};

export const insertAddParticipantAuditTrail = async (
  userEmail: string,
  data: z.infer<typeof ParticipantCreationAndApprovalPartial>
) => {
  const user = await findUserByEmail(userEmail);
  const eventData: AddParticipantEventData = {
    siteId: data.siteId!,
    apiRoles: data.apiRoles.map((role) => role.id),
    participantName: data.name,
    email: data.users[0].email,
    firstName: data.users[0].firstName,
    lastName: data.users[0].lastName,
    participantTypes: data.types.map((type) => type.id),
    role: data.users[0].role!,
    crmAgreementNumber: data.crmAgreementNumber,
  };

  return AuditTrail.query().insert({
    userId: user?.id!,
    userEmail,
    event: AuditTrailEvents.AddParticipant,
    eventData,
    succeeded: false,
  });
};

export const updateAuditTrailToProceed = async (id: number) => {
  return AuditTrail.query().patch({ succeeded: true }).where('id', id);
};
