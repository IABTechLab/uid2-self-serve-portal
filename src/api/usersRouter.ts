import express from 'express';
import { z } from 'zod';

import { User, UserCreationPartial, UserRole } from './entities/User';
import { getLoggers } from './helpers/loggingHelpers';
import { getKcAdminClient } from './keycloakAdminClient';
import { queryUsersByEmail, sendInviteEmail } from './services/kcUsersService';
import {
  enrichCurrentUser,
  enrichWithUserFromParams,
  findUserByEmail,
  UserRequest,
} from './services/usersService';

export function createUsersRouter() {
  const usersRouter = express.Router();
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

  usersRouter.put('/current/acceptTerms', enrichCurrentUser, async (req: UserRequest, res) => {
    await req.user!.$query().patch({ acceptedTerms: true });
    return res.sendStatus(200);
  });

  usersRouter.use('/:userId', enrichWithUserFromParams);

  usersRouter.get('/:userId', async (req: UserRequest, res) => {
    return res.status(200).json(req.user);
  });

  usersRouter.get('/:userId/participant', async (req: UserRequest, res) => {
    const participant = await req.user!.$relatedQuery('participant').withGraphFetched('types');
    return res.status(200).json(participant);
  });

  usersRouter.post('/:userId/resendInvitation', async (req: UserRequest, res) => {
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
  });

  usersRouter.delete('/:userId', async (req: UserRequest, res) => {
    const { user } = req;
    if (req.auth?.payload?.email === user?.email) {
      return res.status(403).send([{ message: 'You do not have permission to delete yourself.' }]);
    }
    await user!.$query().delete();
    return res.sendStatus(200);
  });

  const UpdateUserParser = z.object({
    firstName: z.string(),
    lastName: z.string(),
    role: z.nativeEnum(UserRole),
  });

  usersRouter.patch('/:userId', async (req: UserRequest, res) => {
    const { user } = req;
    const data = UpdateUserParser.parse(req.body);
    await user!.$query().patch(data);
    return res.sendStatus(200);
  });

  return usersRouter;
}
