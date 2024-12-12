import { Response } from 'express';

import { Participant } from '../../entities/Participant';
import {
  getAllParticipants,
  ParticipantRequest,
  updateParticipant,
  UserParticipantRequest,
} from '../../services/participantsService';

export const handleUpdateParticipant = async (req: UserParticipantRequest, res: Response) => {
  const { participant } = req;
  if (!participant) {
    return res.status(404).send('Unable to find participant');
  }
  await updateParticipant(participant, req);
  return res.sendStatus(200);
};

export const handleGetParticipant = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  return res.status(200).json(participant);
};

export const handleGetAllParticipants = async (_req: ParticipantRequest, res: Response) => {
  const participants = await getAllParticipants();
  const result = participants.sort((a, b) => a.name.localeCompare(b.name));
  return res.status(200).json(result);
};

export const handleCompleteRecommendations = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const updatedParticipant = await Participant.query()
    .patchAndFetchById(participant!.id, {
      completedRecommendations: true,
    })
    .withGraphFetched('types');
  return res.status(200).json(updatedParticipant);
};
