import { NextFunction, Request, Response } from 'express';
import { TransactionOrKnex } from 'objection';
import { z } from 'zod';

import { ApiRole } from '../entities/ApiRole';
import { AuditAction, AuditTrailEvents } from '../entities/AuditTrail';
import {
  Participant,
  ParticipantApprovalPartial,
  ParticipantCreationPartial,
  ParticipantDTO,
  ParticipantStatus,
} from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { User } from '../entities/User';
import { SSP_WEB_BASE_URL } from '../envars';
import { getTraceId } from '../helpers/loggingHelpers';
import { getSharingList, setSiteClientTypes, updateSharingList } from './adminServiceClient';
import { ClientType, SharingListResponse } from './adminServiceHelpers';
import { findApproversByType, getApprovableParticipantTypeIds } from './approversService';
import {
  constructAuditTrailObject,
  performAsyncOperationWithAuditTrail,
} from './auditTrailService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';
import { findUserByEmail, isUserBelongsToParticipant } from './usersService';

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export interface UserParticipantRequest extends ParticipantRequest {
  user?: User;
}

export const getParticipantTypesByIds = async (
  participantTypeIds: number[]
): Promise<ParticipantType[]> => {
  return ParticipantType.query().findByIds(participantTypeIds);
};

export const sendNewParticipantEmail = async (
  newParticipant: z.infer<typeof ParticipantCreationPartial>,
  typeIds: number[],
  traceId: string
) => {
  const participantTypes = await getParticipantTypesByIds(typeIds);
  const emailService = createEmailService();
  const requestor = newParticipant.users![0];
  const templateData = {
    participant: newParticipant.name,
    participantType: participantTypes.map((pt) => pt.typeName).join(', '),
    requestor: `${requestor.firstName} ${requestor.lastName}`,
    requestorEmail: requestor.email,
    jobFunction: requestor.role,
  };

  const approvers = await findApproversByType(typeIds);
  const emailArgs: EmailArgs = {
    subject: 'New Participant Request',
    templateData,
    template: 'newParticipantReadyForReview',
    to: approvers.map((a) => ({ name: a.displayName, email: a.email })),
  };
  emailService.sendEmail(emailArgs, traceId);
};

export const getParticipantsAwaitingApproval = async (email: string): Promise<Participant[]> => {
  const approvableParticipantTypeIds = await getApprovableParticipantTypeIds(email);
  const participantsAwaitingApproval = await Participant.query()
    .whereIn(
      'id',
      Participant.relatedQuery('types')
        .whereIn('participantTypeId', approvableParticipantTypeIds)
        .select('participantId')
    )
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

export const updateParticipantAndTypesAndRoles = async (
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

const updateParticipantParser = z.object({
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
  } = updateParticipantParser.parse(req.body);
  const { user } = req;
  const traceId = getTraceId(req);

  const auditTrailInsertObject = constructAuditTrailObject(
    user!,
    AuditTrailEvents.ManageParticipant,
    {
      action: AuditAction.Update,
      apiRoles,
      participantName,
      participantTypes: participantTypeIds,
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

const idParser = z.object({
  participantId: z.coerce.number(),
});

// TODO: move this middleware to a separate file
const hasParticipantAccess = async (req: ParticipantRequest, res: Response, next: NextFunction) => {
  const { participantId } = idParser.parse(req.params);
  const traceId = getTraceId(req);
  const participant = await Participant.query().findById(participantId).withGraphFetched('types');
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  const currentUserEmail = req.auth?.payload?.email as string;
  if (!(await isUserBelongsToParticipant(currentUserEmail, participantId, traceId))) {
    return res.status(403).send([{ message: 'You do not have permission to that participant.' }]);
  }

  req.participant = participant;
  return next();
};

// TODO: move this middleware to a separate file
const enrichCurrentParticipant = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const userEmail = req.auth?.payload?.email as string;
  const user = await findUserByEmail(userEmail);
  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
  const participant = user.participants?.[0];

  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }
  req.participant = participant;
  return next();
};

// TODO: move this middleware to a separate file
export const checkParticipantId = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  // TODO: Remove support for 'current' in UID2-2822
  if (req.params.participantId === 'current') {
    return enrichCurrentParticipant(req, res, next);
  }
  return hasParticipantAccess(req, res, next);
};
