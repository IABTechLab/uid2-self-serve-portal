import { Response } from 'express';

import { ParticipantRequest } from '../../services/participantsService';
import { getSignedParticipants } from '../../services/signedParticipantsService';

export const handleGetSignedParticipants = async (_req: ParticipantRequest, res: Response) => {
  const signedParticipants = await getSignedParticipants();
  const result = signedParticipants.sort((a, b) => a.name.localeCompare(b.name));
  return res.status(200).json(result);
};
