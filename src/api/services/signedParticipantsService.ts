import { SignedParticipant, SignedParticipantDTO } from '../entities/SignedParticipant';

export const getSignedParticipants = async (): Promise<SignedParticipantDTO[]> => {
  return SignedParticipant.query();
};
