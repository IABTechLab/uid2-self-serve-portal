import express from 'express';
import { z } from 'zod';

import { User, UserScheme } from './entities/User';
import { findUserByEmail } from './services/usersService';

export const usersRouter = express.Router();
const emailParser = z.object({
  email: z.string().optional(),
});

usersRouter.get('/', async (req, res) => {
  const { email } = emailParser.parse(req.query);
  if (!email) {
    const users = await User.query();
    return res.status(200).json(users);
  }
  const userResult = await findUserByEmail(email);
  if (userResult) return res.json(userResult);
  return res.sendStatus(404);
});

usersRouter.post('/', async (req, res) => {
  const data = UserScheme.parse(req.body);
  const user = await User.query().insert(data);
  res.status(201).json(user);
});

const userIdParser = z.object({
  userId: z.string(),
});

usersRouter.get('/:userId', async (req, res) => {
  const { userId } = userIdParser.parse(req.params);
  const user = await User.query().findById(userId);
  return res.status(200).json(user);
});

usersRouter.get('/:userId/participant', async (req, res) => {
  const { userId } = userIdParser.parse(req.params);
  const participant = await User.relatedQuery('participant').for(userId).withGraphFetched('types');
  return res.status(200).json(participant[0]);
});
