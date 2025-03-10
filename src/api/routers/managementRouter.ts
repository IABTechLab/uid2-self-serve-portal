import express, { Response } from 'express';
import { z } from 'zod';

import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { getAllUsersList, getUserById, updateUserLock } from '../services/managementService';
import { ParticipantRequest } from '../services/participantsService';
import { handleGetAuditTrail } from './auditTrail';

const handleGetAllUsers = async (req: ParticipantRequest, res: Response) => {
  const userList = await getAllUsersList();
  return res.status(200).json(userList);
};

const handleChangeUserLock = async (req: ParticipantRequest, res: Response) => {
  const { userId } = z.object({ userId: z.coerce.number() }).parse(req.params);
  const { isLocked } = z.object({ isLocked: z.boolean() }).parse(req.body);
  const user = await getUserById(userId);
  if (req.auth?.payload?.email === user?.email) {
    res.status(403).send([{ message: 'You cannot lock yourself.' }]);
    return;
  }
  await updateUserLock(req, userId, isLocked);
  return res.status(200).end();
};

export function createManagementRouter() {
  const managementRouter = express.Router();

  managementRouter.get('/users', isSuperUserCheck, handleGetAllUsers);
  managementRouter.get('/users/auditTrail', isSuperUserCheck, handleGetAuditTrail);
  managementRouter.patch('/:userId/changeLock', isSuperUserCheck, handleChangeUserLock);

  return managementRouter;
}
