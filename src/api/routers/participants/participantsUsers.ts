import { Response } from 'express';

import { ParticipantRequest } from '../../services/participantsService';
import { getAllUserFromParticipant } from '../../services/usersService';

export async function getParticipantUsers(req: ParticipantRequest, res: Response) {
  const { participant } = req;
  const users = await getAllUserFromParticipant(participant!);
  return res.status(200).json(users);
}
