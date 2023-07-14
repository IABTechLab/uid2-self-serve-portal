import express from 'express';
import { z } from 'zod';

import { User, UserCreationPartial } from './entities/User';
import { getLoggers } from './helpers/loggingHelpers';
import { getKcAdminClient } from './keycloakAdminClient';
import { queryUsersByEmail, sendInviteEmail } from './services/kcUsersService';
import { enrichWithUserFromParams, findUserByEmail, UserRequest } from './services/usersService';

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
  const data = UserCreationPartial.parse(req.body);
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

usersRouter.post(
  '/:userId/resendInvitation',
  enrichWithUserFromParams,
  async (req: UserRequest, res) => {
    const [logger, errorLogger] = getLoggers();

    const kcAdminClient = await getKcAdminClient();
    const user = await queryUsersByEmail(kcAdminClient, req.user?.email || '');

    const resultLength = user?.length ?? 0;
    if (resultLength < 1) {
      return res.sendStatus(404);
    }
    if (resultLength > 1) {
      errorLogger.error(`Multiple results received when loading user entry for ${req.user?.email}`);
      return res.sendStatus(500);
    }

    logger.info(`Resending invitation email for ${req.user?.email}, keycloak ID ${user[0].id}`);
    await sendInviteEmail(kcAdminClient, user[0]);
    return res.sendStatus(200);
  }
);
