import { z } from 'zod';

import { ParticipantSchema } from '../entities/Participant';
import { ParticipantType } from '../entities/ParticipantType';
import { createEmailService } from './emailService';
import { EmailArgs } from './emailTypes';

export const sendNewParticipantEmail = async (
  newParticipant: z.infer<typeof ParticipantSchema>,
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
    link: 'http://localhost:3000/',
  };
  const emailArgs: EmailArgs = {
    subject: 'New Participant Request',
    templateData,
    template: 'newParticipantReadyForReview',
    to: { name: 'TAMs', email: 'jingyi.gao@thetradedesk.com' },
  };
  emailService.sendEmail(emailArgs);
};
