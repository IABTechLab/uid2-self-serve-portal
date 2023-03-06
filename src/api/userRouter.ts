import express from 'express';
import { z } from 'zod';

import { User } from './entities/User';

export const userRouter = express.Router();
userRouter.get('/', async (_req, res) => {
  const users = await User.query();
  return res.status(200).json(users);
});

const emailParser = z.object({
  email: z.string(),
});

userRouter.get('/byEmail', async (req, res) => {
  const { email } = emailParser.parse(req.query);
  if (!email) {
    return res.sendStatus(404);
  }

  const userResult = await User.query().where('email', email);
  if (userResult.length === 1) return res.json(userResult);
  if (userResult.length > 1) {
    return res.status(500).json('Duplicate accounts found, please contact support');
  }
  return res.sendStatus(404);
});

const userIdParser = z.object({
  userId: z.string(),
});

userRouter.get('/:userId', async (req, res) => {
  const { userId } = userIdParser.parse(req.params);
  const user = await User.query().findById(userId);
  return res.status(200).json(user);
});
