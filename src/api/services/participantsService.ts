import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { Participant, ParticipantCreationPartial } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { SSP_WEB_BASE_URL } from '../envars';
import { getSharingList, SharingListResponse, updateSharingList } from './adminServiceClient';
import { findApproversByType } from './approversService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';
import { findUserByEmail, isUserBelongsToParticipant } from './usersService';

export interface ParticipantRequest extends Request {
  participant?: Participant;
}

export const sendNewParticipantEmail = async (
  newParticipant: z.infer<typeof ParticipantCreationPartial>,
  typeIds: number[]
) => {
  const participantTypes = await ParticipantType.query().findByIds(typeIds);
  const emailService = createEmailService();
  const requestor = newParticipant.users![0];
  const templateData = {
    participant: newParticipant.name,
    participantType: participantTypes.map((pt) => pt.typeName).join(', '),
    requestor: `${requestor.firstName} ${requestor.lastName}`,
    requestorEmail: requestor.email,
    participantLocation: requestor.location,
    jobFunction: requestor.role,
    link: SSP_WEB_BASE_URL,
  };

  const approvers = await findApproversByType(typeIds);
  const emailArgs: EmailArgs = {
    subject: 'New Participant Request',
    templateData,
    template: 'newParticipantReadyForReview',
    to: approvers.map((a) => ({ name: a.displayName, email: a.email })),
  };
  emailService.sendEmail(emailArgs);
};

export const fetchSharingParticipants = async (
  sharingListResponse: SharingListResponse
): Promise<Participant[]> => {
  return Participant.query()
    .whereIn('siteId', sharingListResponse.whitelist)
    .withGraphFetched('types');
};

export const getSharingParticipants = async (participantSiteId: number): Promise<Participant[]> => {
  const sharingListResponse = await getSharingList(participantSiteId);
  return fetchSharingParticipants(sharingListResponse);
};

export const addSharingParticipants = async (
  participantSiteId: number,
  siteIds: number[]
): Promise<Participant[]> => {
  const sharingListResponse = await getSharingList(participantSiteId);
  const newSharingSet = new Set([...sharingListResponse.whitelist, ...siteIds]);
  const response = await updateSharingList(participantSiteId, sharingListResponse.whitelist_hash, [
    ...newSharingSet,
  ]);
  return fetchSharingParticipants(response);
};

export const deleteSharingParticipants = async (
  participantSiteId: number,
  siteIds: number[]
): Promise<Participant[]> => {
  const sharingListResponse = await getSharingList(participantSiteId);
  const newSharingList = sharingListResponse.whitelist.filter(
    (siteId) => !siteIds.includes(siteId)
  );
  const response = await updateSharingList(
    participantSiteId,
    sharingListResponse.whitelist_hash,
    newSharingList
  );
  return fetchSharingParticipants(response);
};

const idParser = z.object({
  participantId: z.coerce.number(),
});

const hasParticipantAccess = async (req: ParticipantRequest, res: Response, next: NextFunction) => {
  const { participantId } = idParser.parse(req.params);
  const participant = await Participant.query().findById(participantId);
  if (!participant) {
    return res.status(404).send([{ message: 'The participant cannot be found.' }]);
  }

  if (!(await isUserBelongsToParticipant(req.auth?.payload?.email as string, participantId))) {
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
  const participant = await Participant.query().findById(user.participantId);
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
