import { Response } from 'express';

import { ApiRoleDTO } from '../../entities/ApiRole';
import { getApiRoles } from '../../services/apiKeyService';
import { ParticipantRequest } from '../../services/participantsService';

export const handleGetParticipantApiRoles = async (req: ParticipantRequest, res: Response) => {
  const { participant } = req;
  const apiRoles: ApiRoleDTO[] = await getApiRoles(participant!);
  return res.status(200).json(apiRoles);
};
