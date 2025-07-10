import { ParticipantDTO } from '../../../api/entities/Participant';

export const getContactInformation = (participant: ParticipantDTO) => {
  const defaultMessage = 'Information not available';

  // const primaryContact = participant;
  // if (primaryContact) {
  //   return primaryContact;
  // }

  return participant.primaryContact
    ? participant.primaryContact
    : {
        firstName: defaultMessage,
        lastName: defaultMessage,
        email: defaultMessage,
      };
};
