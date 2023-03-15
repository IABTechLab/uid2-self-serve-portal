import express from 'express';
import { z } from 'zod';

import { User, UserScheme } from './entities/User';

export const usersRouter = express.Router();
usersRouter.get('/', async (_req, res) => {
  const users = await User.query();
  return res.status(200).json(users);
});

usersRouter.post('/', async (req, res) => {
  const data = UserScheme.parse(req.body);
  const user = await User.query().insert(data);
  res.status(201).json(user);
});

const emailParser = z.object({
  email: z.string(),
});

usersRouter.get('/byEmail', async (req, res) => {
  const { email } = emailParser.parse(req.query);
  if (!email) {
    return res.sendStatus(404);
  }

  const userResult = await User.query().where('email', email);
  if (userResult.length === 1) return res.json(userResult[0]);
  if (userResult.length > 1) {
    return res.status(500).json('Duplicate accounts found, please contact support');
  }
  return res.sendStatus(404);
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
  const paritcipant = await User.relatedQuery('participant').for(userId);
  return res.status(200).json(paritcipant[0]);
});
