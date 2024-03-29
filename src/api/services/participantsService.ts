import { NextFunction, Request, Response } from 'express';
import { TransactionOrKnex } from 'objection';
import { z } from 'zod';

import { ApiRole } from '../entities/ApiRole';
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
import { getSharingList, updateSharingList } from './adminServiceClient';
import { ClientType, SharingListResponse } from './adminServiceHelpers';
import { findApproversByType, getApprovableParticipantTypeIds } from './approversService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';
import { findUserByEmail, isUserBelongsToParticipant } from './usersService';

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export interface UserParticipantRequest extends ParticipantRequest {
  user?: User;
}

export const sendNewParticipantEmail = async (
  newParticipant: z.infer<typeof ParticipantCreationPartial>,
  typeIds: number[],
  traceId: string
) => {
  const participantTypes = await ParticipantType.query().findByIds(typeIds);
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
    .withGraphFetched('apiRoles');
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
  }
) => {
  await Participant.transaction(async (trx) => {
    await participant.$query(trx).patch({
      name: participantApprovalPartial.name,
      siteId: participantApprovalPartial.siteId,
      status: participantApprovalPartial.status,
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

export const updateParticipantApiRoles = async (participant: Participant, apiRoles: number[]) => {
  await Participant.transaction(async (trx) => {
    await updateParticipantApiRolesWithTransaction(
      participant,
      apiRoles.map((role) => ({
        id: role,
      })),
      trx
    );
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
  const participant = await Participant.query().findById(user.participantId!);
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }
  req.participant = participant;
  return next();
};

export const checkParticipantId = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.params.participantId === 'current') {
    return enrichCurrentParticipant(req, res, next);
  }
  return hasParticipantAccess(req, res, next);
};
