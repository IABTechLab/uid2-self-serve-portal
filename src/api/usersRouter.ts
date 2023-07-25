import express from 'express';
import { z } from 'zod';

import { UserRole } from './entities/User';
import { getLoggers } from './helpers/loggingHelpers';
import { getKcAdminClient } from './keycloakAdminClient';
import {
  deleteUserByEmail,
  queryUsersByEmail,
  sendInviteEmail,
  updateUserProfile,
} from './services/kcUsersService';
import {
  enrichCurrentUser,
  enrichUserWithIsApprover,
  enrichWithUserFromParams,
  UserRequest,
} from './services/usersService';

export function createUsersRouter() {
  const usersRouter = express.Router();
  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', async (req: UserRequest, res) => {
    const userWithIsApprover = await enrichUserWithIsApprover(req.user!);
    return res.json(userWithIsApprover);
  });

  usersRouter.put('/current/acceptTerms', async (req: UserRequest, res) => {
    await req.user!.$query().patch({ acceptedTerms: true });
    return res.sendStatus(200);
  });

  usersRouter.get('/current/participant', async (req: UserRequest, res) => {
    const participant = await req.user!.$relatedQuery('participant').withGraphFetched('types');
    return res.status(200).json(participant);
  });

  usersRouter.use('/:userId', enrichWithUserFromParams);

  usersRouter.get('/:userId', async (req: UserRequest, res) => {
    return res.status(200).json(req.user);
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
    const kcAdminClient = await getKcAdminClient();
    await Promise.all([deleteUserByEmail(kcAdminClient!, user?.email!), user!.$query().delete()]);

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
    const kcAdminClient = await getKcAdminClient();
    await Promise.all([
      updateUserProfile(kcAdminClient, user?.email!, {
        firstName: data.firstName,
        lastName: data.lastName,
      }),
      user!.$query().patch(data),
    ]);
    return res.sendStatus(200);
  });

  return usersRouter;
}
