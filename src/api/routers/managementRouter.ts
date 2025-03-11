import express, { Response } from 'express';
import { z } from 'zod';

import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { GetUserAuditTrail } from '../services/auditTrailService';
import { getAllUsersList, getUserById, updateUserLock } from '../services/managementService';
import { getUserParticipants, ParticipantRequest } from '../services/participantsService';

const handleGetAllUsers = async (req: ParticipantRequest, res: Response) => {
  const userList = await getAllUsersList();
  return res.status(200).json(userList);
};

const handleGetUserAuditTrail = async (req: ParticipantRequest, res: Response) => {
  const { userId } = z.object({ userId: z.coerce.number() }).parse(req.params);
  const auditTrail = await GetUserAuditTrail(userId);
  return res.status(200).json(auditTrail ?? []);
};

const handleGetUserParticipants = async (req: ParticipantRequest, res: Response) => {
  const { userId } = z.object({ userId: z.coerce.number() }).parse(req.params);
  const participants = await getUserParticipants(userId);
  return res.status(200).json(participants ?? []);
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
  managementRouter.get('/:userId/auditTrail', isSuperUserCheck, handleGetUserAuditTrail);
  managementRouter.get('/:userId/participants', isSuperUserCheck, handleGetUserParticipants);
  managementRouter.patch('/:userId/changeLock', isSuperUserCheck, handleChangeUserLock);

  return managementRouter;
}
