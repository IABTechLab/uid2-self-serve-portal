import { Request } from 'express';
import { TransactionOrKnex } from 'objection';
import { z } from 'zod';

import { getRoleNamesByIds } from '../../web/utils/apiRoles';
import { ApiRole } from '../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantDTO,
  ParticipantStatus,
} from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { User, UserDTO } from '../entities/User';
import { SSP_WEB_BASE_URL } from '../envars';
import { getTraceId } from '../helpers/loggingHelpers';
import { getSharingList, setSiteClientTypes, updateSharingList } from './adminServiceClient';
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
import { getAllUid2SupportUsers } from './uid2SupportService';

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export interface UserParticipantRequest extends ParticipantRequest {
  user?: User;
}

export type ParticipantRequestDTO = Pick<
  ParticipantDTO,
  'id' | 'name' | 'siteId' | 'types' | 'status' | 'apiRoles'
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
    status: participant.status,
    requestingUser: {
      email: firstUser ? firstUser.email : '',
      jobFunction: firstUser?.jobFunction,
      fullName: firstUser
        ? firstUser?.fullName()
        : 'There is no user attached to this participant.',
    },
  };
};

export const getParticipantsAwaitingApproval = async (): Promise<Participant[]> => {
  const participantsAwaitingApproval = await Participant.query()
    .withGraphFetched('[types, users]')
    .where('status', ParticipantStatus.AwaitingApproval);
  return participantsAwaitingApproval;
};

type SiteIdType = NonNullable<ParticipantDTO['siteId']>;
export const getAttachedSiteIDs = async (): Promise<SiteIdType[]> => {
  const sites = await Participant.query()
    .whereNotNull('siteId')
    .select('siteId')
    .castTo<Required<Pick<ParticipantDTO, 'siteId'>>[]>();
  return sites.map((s) => s.siteId);
};

export const getParticipantsApproved = async (): Promise<Participant[]> => {
  return Participant.query()
    .where('status', ParticipantStatus.Approved)
    .withGraphFetched('[apiRoles, approver, types, users]');
};

export const getParticipantsBySiteIds = async (siteIds: number[]) => {
  return Participant.query().whereIn('siteId', siteIds).withGraphFetched('types');
};

export const addSharingParticipants = async (
  participantSiteId: number,
  siteIds: number[],
  traceId: string
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
  traceId: string
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
    status: ParticipantStatus;
    approverId: number | undefined;
    dateApproved: Date;
  }
) => {
  await Participant.transaction(async (trx) => {
    await participant.$query(trx).patch({
      name: participantApprovalPartial.name,
      siteId: participantApprovalPartial.siteId,
      status: participantApprovalPartial.status,
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
    setSiteClientTypes({ siteId: participant.siteId, types });
  });
};

export const UpdateSharingTypes = async (
  participantSiteId: number,
  types: ClientType[],
  traceId: string
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

export const sendParticipantApprovedEmail = async (users: User[], traceId: string) => {
  const emailService = createEmailService();
  const emailArgs: EmailArgs = {
    subject: 'Your account has been confirmed',
    templateData: { link: SSP_WEB_BASE_URL },
    template: 'accountHasBeenConfirmed',
    to: users.map((user) => ({ name: user.fullName(), email: user.email })),
  };
  emailService.sendEmail(emailArgs, traceId);
};
