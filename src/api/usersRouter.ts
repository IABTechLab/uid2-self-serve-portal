import express from 'express';
import { z } from 'zod';

import { User, UserScheme } from './entities/User';
import { getLoggedInParticipantId } from './services/securityService';
import { findUserByEmail, getUsersByParticipantId } from './services/usersService';

export const usersRouter = express.Router();
const emailParser = z.object({
  email: z.string().optional(),
});

usersRouter.get('/', async (req, res) => {
  const loggedInParticipantId = await getLoggedInParticipantId(req);
  if (!loggedInParticipantId) return res.sendStatus(401);

  const { email } = emailParser.parse(req.query);
  if (!email) {
    const users = await getUsersByParticipantId(loggedInParticipantId);
    return res.status(200).json(users);
  }

  const userResult = await findUserByEmail(email);
  if (!userResult) return res.sendStatus(404);

  if (userResult.participantId !== loggedInParticipantId) return res.sendStatus(403);

  return res.json(userResult);
});

usersRouter.post('/', async (req, res) => {
  // TODO: This route needs security
  const data = UserScheme.parse(req.body);
  const user = await User.query().insert(data);
  res.status(201).json(user);
});

const userIdParser = z.object({
  userId: z.string(),
});

usersRouter.get('/:userId', async (req, res) => {
  // TODO: This route needs security
  const { userId } = userIdParser.parse(req.params);
  const user = await User.query().findById(userId);
  return res.status(200).json(user);
});

usersRouter.get('/:userId/participant', async (req, res) => {
  // TODO: This route needs security
  const { userId } = userIdParser.parse(req.params);
  const participant = await User.relatedQuery('participant').for(userId);
  return res.status(200).json(participant[0]);
});
