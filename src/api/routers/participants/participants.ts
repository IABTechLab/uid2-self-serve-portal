import { Response } from 'express';

import { ApiRoleDTO } from '../../entities/ApiRole';
import { Participant } from '../../entities/Participant';
import { getApiRoles } from '../../services/apiKeyService';
import {
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

export const handleGetParticipantApiRoles = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const apiRoles: ApiRoleDTO[] = await getApiRoles(participant!);
  return res.status(200).json(apiRoles);
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
