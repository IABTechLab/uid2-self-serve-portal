import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import express from 'express';
import { z } from 'zod';

import { User, UserRole, UserScheme } from './entities/User';
import { SSP_KK_SSL_RESOURCE } from './envars';
import { getKcAdminClient } from './keycloakAdminClient';

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
  const userResult = await User.query().where('email', email);
  if (userResult.length === 1) return res.json(userResult[0]);
  if (userResult.length > 1) {
    return res.status(500).json('Duplicate accounts found, please contact support');
  }
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
  const participant = await User.relatedQuery('participant').for(userId);
  return res.status(200).json(participant[0]);
});

const invitationParser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  jobFunction: z.nativeEnum(UserRole),
  participantId: z.number(),
});
usersRouter.post('/invite', async (req, res) => {
  try {
    const { firstName, lastName, email, participantId, jobFunction } = invitationParser.parse(
      req.body
    );
    const kcAdminClient = await getKcAdminClient();
    const user = await kcAdminClient.users.create({
      firstName,
      lastName,
      email,
      emailVerified: false,
      enabled: true,
      credentials: [
        {
          temporary: true,
          type: 'PASSWORD',
          value: 'test123',
        },
      ],
    });
    const userObject = {
      email,
      role: jobFunction,
      participantId,
    };
    await kcAdminClient.users.executeActionsEmail({
      id: user.id,
      clientId: SSP_KK_SSL_RESOURCE,
      actions: [
        RequiredActionAlias.UPDATE_PASSWORD,
        RequiredActionAlias.UPDATE_PROFILE,
        RequiredActionAlias.VERIFY_EMAIL,
      ],
      redirectUri: 'http://localhost:3000/',
    });
    // await kcAdminClient.users.resetPassword({
    //   id: user.id,
    //   credential: {
    //     temporary: true,
    //     type: 'password',
    //     value: 'test123',
    //   },
    // });
    const sspUser = await User.query().insert(userObject);
    return res.status(200).json(sspUser);
  } catch (e) {
    console.log(e);
    return res.status(500).json('Something went wrong please try again');
  }
});
