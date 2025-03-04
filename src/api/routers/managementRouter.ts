import express, { Response } from 'express';

import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { ParticipantRequest } from '../services/participantsService';
import { getAllUsersList } from '../services/usersService';

const handleGetAllUsers = async (req: ParticipantRequest, res: Response) => {
  const userList = await getAllUsersList();
  return res.status(200).json(userList);
};

export function createManagementRouter() {
  const managementRouter = express.Router();

  managementRouter.get('/users', isSuperUserCheck, handleGetAllUsers);

  return managementRouter;
}
