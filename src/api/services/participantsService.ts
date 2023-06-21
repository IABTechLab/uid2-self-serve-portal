import { z } from 'zod';

import { ParticipantCreationPartial } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { SSP_WEB_BASE_URL } from '../envars';
import { findApproversByType } from './approversService';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';

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
