import { ParticipantDTO } from '../../../api/entities/Participant';

export const getPrimaryContactInformation = (participant: ParticipantDTO) => {
  const defaultMessage = 'Information not available';

  return (
    participant.primaryContact ?? {
      firstName: defaultMessage,
      lastName: defaultMessage,
      email: defaultMessage,
    }
  );
};
