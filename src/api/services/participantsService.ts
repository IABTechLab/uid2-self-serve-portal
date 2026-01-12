import { Request } from 'express';
import { TransactionOrKnex } from 'objection';
import { z } from 'zod';

import { ApiRole } from '../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import { Participant, ParticipantDTO } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { PrimaryContact } from '../entities/PrimaryContact';
import { ParticipantApprovalPartial } from '../entities/Schemas';
import { User, UserDTO } from '../entities/User';
import { SSP_WEB_BASE_URL } from '../envars';
import { getRoleNamesByIds } from '../helpers/apiHelper';
import { getTraceId, TraceId } from '../helpers/loggingHelpers';
import {
  getSharingList,
  getSite,
  setSiteClientTypes,
  setSiteVisibility,
  updateSharingList,
} from './adminServiceClient';
import {
  ClientType,
  mapClientTypeIdsToAdminEnums,
  SharingListResponse,
} from './adminServiceHelpers';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export interface UserParticipantRequest extends ParticipantRequest {
  user?: User;
}

export type ParticipantRequestDTO = Pick<
  ParticipantDTO,
  'id' | 'name' | 'siteId' | 'types' | 'apiRoles'
> & {
  requestingUser: Pick<UserDTO, 'email'> &
    Partial<Pick<UserDTO, 'jobFunction'>> & { fullName: string };
};

export const getParticipantTypesByIds = async (
  participantTypeIds: number[]
): Promise<ParticipantType[]> => {
  return ParticipantType.query().findByIds(participantTypeIds);
};

export const mapParticipantToApprovalRequest = (
  participant: Participant
): ParticipantRequestDTO => {
  // There should usually only be one user at this point - but if there are multiple, the first one is preferred.
  const firstUser = participant.users?.sort((a, b) => a.id - b.id)[0];
  return {
    id: participant.id,
    name: participant.name,
    siteId: participant.siteId,
    types: participant.types,
    apiRoles: participant.apiRoles,
    requestingUser: {
      email: firstUser ? firstUser.email : '',
      jobFunction: firstUser?.jobFunction,
      fullName: firstUser
        ? firstUser?.fullName()
        : 'There is no user attached to this participant.',
    },
  };
};

type SiteIdType = NonNullable<ParticipantDTO['siteId']>;
export const getAttachedSiteIDs = async (): Promise<SiteIdType[]> => {
  const sites = await Participant.query()
    .whereNotNull('siteId')
    .select('siteId')
    .castTo<Required<Pick<ParticipantDTO, 'siteId'>>[]>();
  return sites.map((s) => s.siteId);
};

export const getAllParticipants = async (): Promise<Participant[]> => {
  return Participant.query()
    .whereNotNull('dateApproved')
    .withGraphFetched('[apiRoles, approver, types, users, primaryContact]');
};

export const getUserParticipants = async (userId: number): Promise<Participant[]> => {
  return Participant.query()
    .withGraphFetched('participantToUserRoles')
    .modifyGraph('participantToUserRoles', (row) => {
      row.where('userId', userId);
    });
};

export const getParticipantsBySiteIds = async (siteIds: number[]) => {
  return Participant.query().whereIn('siteId', siteIds).withGraphFetched('types');
};

/**
 * Get participant/site names for a list of siteIds.
 * Uses participant name if available, falls back to Admin site name.
 */
export const getSiteNamesForAuditLog = async (
  siteIds: number[],
  traceId: TraceId
): Promise<string[]> => {
  // Get participants that have these siteIds
  const participants = await Participant.query()
    .whereIn('siteId', siteIds)
    .select('siteId', 'name');

  const participantMap = new Map(
    participants.map((p) => [p.siteId, p.name])
  );

  // For siteIds without a participant, fetch from Admin
  const missingSiteIds = siteIds.filter((id) => !participantMap.has(id));

  if (missingSiteIds.length > 0) {
    // Fetch site names from Admin for sites without participants
    const adminSitePromises = missingSiteIds.map(async (siteId) => {
      try {
        const site = await getSite(siteId, traceId);
        return { siteId, name: site.name };
      } catch {
        // If Admin lookup fails, use siteId as fallback
        return { siteId, name: `Site ${siteId}` };
      }
    });

    const adminSites = await Promise.all(adminSitePromises);
    adminSites.forEach(({ siteId, name }) => {
      participantMap.set(siteId, name);
    });
  }

  // Return names in the same order as input siteIds
  return siteIds.map((id) => participantMap.get(id) ?? `Site ${id}`);
};

export const addSharingParticipants = async (
  participantSiteId: number,
  siteIds: number[],
  traceId: TraceId
): Promise<SharingListResponse> => {
  const sharingListResponse = await getSharingList(participantSiteId, traceId);
  const newSharingSet = new Set([...sharingListResponse.allowed_sites, ...siteIds]);
  const response = await updateSharingList(
    participantSiteId,
    sharingListResponse.hash,
    [...newSharingSet],
    sharingListResponse.allowed_types,
    traceId
  );
  return response;
};

export const deleteSharingParticipants = async (
  participantSiteId: number,
  siteIds: number[],
  traceId: TraceId
): Promise<SharingListResponse> => {
  const sharingListResponse = await getSharingList(participantSiteId, traceId);
  const newSharingList = sharingListResponse.allowed_sites.filter(
    (siteId) => !siteIds.includes(siteId)
  );
  return updateSharingList(
    participantSiteId,
    sharingListResponse.hash,
    newSharingList,
    sharingListResponse.allowed_types,
    traceId
  );
};

const updateParticipantRequestTypesWithTransaction = async (
  participant: Participant,
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial>,
  trx: TransactionOrKnex
) => {
  await participant.$relatedQuery('types', trx).unrelate();
  await participant.$relatedQuery('types', trx).relate(participantApprovalPartial.types);
};

export const updateParticipantApiRolesWithTransaction = async (
  participant: Participant,
  apiRoleIds: {
    id: number;
  }[],
  trx: TransactionOrKnex
) => {
  await participant.$relatedQuery('apiRoles', trx).unrelate();

  const apiRoles = await ApiRole.query()
    .whereIn(
      'id',
      apiRoleIds.map((role) => role.id)
    )
    .where('disabled', false);

  if (apiRoles.length > 0) {
    await participant.$relatedQuery('apiRoles', trx).relate(apiRoles);
  }
};

export const updateParticipantAndTypesAndApiRoles = async (
  participant: Participant,
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial> & {
    approverId: number | undefined;
    dateApproved: Date;
  }
) => {
  await Participant.transaction(async (trx) => {
    await participant.$query(trx).patch({
      name: participantApprovalPartial.name,
      siteId: participantApprovalPartial.siteId,
      approverId: participantApprovalPartial.approverId,
      dateApproved: participantApprovalPartial.dateApproved,
    });
    await updateParticipantRequestTypesWithTransaction(
      participant,
      participantApprovalPartial,
      trx
    );
    await updateParticipantApiRolesWithTransaction(
      participant,
      participantApprovalPartial.apiRoles,
      trx
    );
  });
};

export const updateParticipantApiRoles = async (
  participant: Participant,
  apiRoles: number[],
  trx: TransactionOrKnex
) => {
  const apiRoleIds = apiRoles.map((role) => ({
    id: role,
  }));
  await participant.$relatedQuery('apiRoles', trx).unrelate();

  const apiRolesQuery = await ApiRole.query()
    .whereIn(
      'id',
      apiRoleIds.map((role) => role.id)
    )
    .where('disabled', false);

  if (apiRolesQuery.length > 0) {
    await participant.$relatedQuery('apiRoles', trx).relate(apiRolesQuery);
  }
};

export const updateParticipantTypes = async (
  participant: Participant,
  participantTypes: number[],
  trx: TransactionOrKnex
) => {
  const participantTypeIds = participantTypes.map((pType) => ({
    id: pType,
  }));
  await participant.$relatedQuery('types', trx).unrelate();

  const participantTypesQuery = await ParticipantType.query().whereIn(
    'id',
    participantTypeIds.map((pType) => pType.id)
  );

  if (participantTypesQuery.length > 0) {
    await participant.$relatedQuery('types', trx).relate(participantTypesQuery);
  }
};

const updateParticipantSchema = z.object({
  apiRoles: z.array(z.number()),
  participantTypes: z.array(z.number()),
  participantName: z.string(),
  crmAgreementNumber: z.string().nullable(),
  visible: z.boolean().optional(),
});
export const updateParticipant = async (participant: Participant, req: UserParticipantRequest) => {
  const {
    apiRoles,
    participantTypes: participantTypeIds,
    participantName,
    crmAgreementNumber,
  } = updateParticipantSchema.parse(req.body);
  const { user } = req;
  const traceId = getTraceId(req);

  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.ManageParticipant,
    {
      action: AuditAction.Update,
      apiRoles: getRoleNamesByIds(apiRoles),
      participantName,
      participantTypes: mapClientTypeIdsToAdminEnums(participantTypeIds),
      crmAgreementNumber,
    }
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
    await Participant.transaction(async (trx) => {
      await Participant.query()
        .where('id', participant.id)
        .update({ name: participantName, crmAgreementNumber });
      await updateParticipantTypes(participant, participantTypeIds, trx);
      await updateParticipantApiRoles(participant, apiRoles, trx);
    });
    const types = await getParticipantTypesByIds(participantTypeIds);
    setSiteClientTypes({ siteId: participant.siteId, types }, traceId);
  });
};

const visibilityOnlySchema = z.object({
  visible: z.boolean(),
});
export const setParticipantVisibility = async (
  participant: Participant,
  req: UserParticipantRequest
) => {
  const { visible } = visibilityOnlySchema.parse(req.body);
  const traceId = getTraceId(req);

  if (visible !== undefined && participant.siteId !== undefined) {
    await setSiteVisibility(participant.siteId, visible, traceId);
  }
};

export const getParticipantVisibility = async (req: ParticipantRequest) => {
  const { participant } = req;
  const traceId = getTraceId(req);
  if (!participant?.siteId) {
    return null;
  }
  const participantSite = await getSite(participant.siteId, traceId);
  return participantSite.visible;
};

export const UpdateSharingTypes = async (
  participantSiteId: number,
  types: ClientType[],
  traceId: TraceId
): Promise<SharingListResponse> => {
  const sharingListResponse = await getSharingList(participantSiteId, traceId);
  return updateSharingList(
    participantSiteId,
    sharingListResponse.hash,
    sharingListResponse.allowed_sites,
    types,
    traceId
  );
};

export const sendParticipantApprovedEmail = async (users: User[], traceId: TraceId) => {
  const emailService = createEmailService();
  const emailArgs: EmailArgs = {
    subject: 'Your account has been confirmed',
    templateData: { link: SSP_WEB_BASE_URL },
    template: 'accountHasBeenConfirmed',
    to: users.map((user) => ({ name: user.fullName(), email: user.email })),
  };
  emailService.sendEmail(emailArgs, traceId);
};

export async function updatePrimaryContact(
  participantId: number,
  newUserId: number,
  req: UserParticipantRequest
) {
  const { user } = req;
  const traceId = getTraceId(req);

  const existing = await PrimaryContact.query().findOne({ participantId });
  const existingUser = existing?.userId ? await User.query().findById(existing.userId) : null;
  const newUser = await User.query().findById(newUserId);

  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.UpdatePrimaryContact,
    {
      action: AuditAction.Update,
      previousPrimaryContact: existingUser?.email ?? null,
      newPrimaryContact: newUser?.email ?? null,
    },
    participantId
  );

  await performAsyncOperationWithAuditTrail(auditTrailInsertObject, traceId, async () => {
    if (existing) {
      await PrimaryContact.query().delete().where({ participantId });
    }

    await PrimaryContact.query().insert({
      participantId,
      userId: newUserId,
    });
  });
}
