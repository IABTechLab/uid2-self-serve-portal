import express, { Response } from 'express';
import { z } from 'zod';

import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { ParticipantRequest } from '../services/participantsService';
import { UserService } from '../services/userService';
import { getAllUsersList } from '../services/usersService';

const handleGetAllUsers = async (req: ParticipantRequest, res: Response) => {
  const userList = await getAllUsersList();
  return res.status(200).json(userList);
};

const handleChangeUserLock = async (req: ParticipantRequest, res: Response) => {
  const userService = new UserService();
  const { userId } = z.object({ userId: z.coerce.number() }).parse(req.params);
  const { isLocked } = z.object({ isLocked: z.boolean() }).parse(req.body);
  await userService.updateUserLock(req, userId, isLocked);
};

export function createManagementRouter() {
  const managementRouter = express.Router();

  managementRouter.get('/users', isSuperUserCheck, handleGetAllUsers);
  managementRouter.patch('/:userId/changeLock', isSuperUserCheck, handleChangeUserLock);

  return managementRouter;
}
