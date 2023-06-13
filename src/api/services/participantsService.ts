import { z } from 'zod';

import { Participant, ParticipantCreationPartial } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { SSP_TAM_EMAIL, SSP_TAM_EMAIL_DISPLAY_NAME, SSP_WEB_BASE_URL } from '../envars';
import { getSharingList, updateSharingList } from './adminServiceClient';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';

export const sendNewParticipantEmail = async (
  newParticipant: z.infer<typeof ParticipantCreationPartial>,
  participantTypes: ParticipantType[]
) => {
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
  const emailArgs: EmailArgs = {
    subject: 'New Participant Request',
    templateData,
    template: 'newParticipantReadyForReview',
    to: { name: SSP_TAM_EMAIL_DISPLAY_NAME, email: SSP_TAM_EMAIL },
  };
  emailService.sendEmail(emailArgs);
};

export const getSharingParticipants = async (participantSiteId: number): Promise<Participant[]> => {
  const sharingListResponse = await getSharingList(participantSiteId);
  return Participant.query().whereIn('siteId', sharingListResponse.whiteList);
};

export const addSharingParticipants = async (participantSiteId: number, siteIds: number[]) => {
  const sharingListResponse = await getSharingList(participantSiteId);
  const newSharingList = [...sharingListResponse.whiteList, ...siteIds];
  return updateSharingList(participantSiteId, sharingListResponse.whitelist_hash, newSharingList);
};

export const deleteSharingParticipants = async (participantSiteId: number, siteIds: number[]) => {
  const sharingListResponse = await getSharingList(participantSiteId);
  const newSharingList = sharingListResponse.whiteList.filter(
    (siteId) => !siteIds.includes(siteId)
  );
  return updateSharingList(participantSiteId, sharingListResponse.whitelist_hash, newSharingList);
};
