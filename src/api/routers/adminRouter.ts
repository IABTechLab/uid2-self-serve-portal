import express, { Response } from 'express';

import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { ParticipantRequest } from '../services/participantsService';
import { getAdminUserList } from '../services/usersService';

const handleGetAllUsersAdmin = async (req: ParticipantRequest, res: Response) => {
  const userList = await getAdminUserList();
  return res.status(200).json(userList);
};

export function createAdminRouter() {
  const adminRouter = express.Router();

  adminRouter.get('/users', isSuperUserCheck, handleGetAllUsersAdmin);

  return adminRouter;
}
