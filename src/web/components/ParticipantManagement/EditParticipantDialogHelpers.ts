import { ParticipantDTO } from '../../../api/entities/Participant';

export const getContactInformation = (participant: ParticipantDTO) => {
  const defaultMessage = 'Information not available';
  return participant.users && participant.users.length > 0
    ? participant.users[0]
    : {
        firstName: defaultMessage,
        lastName: defaultMessage,
        email: defaultMessage,
      };
};
