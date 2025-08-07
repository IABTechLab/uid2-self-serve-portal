import { AxiosError } from 'axios';
import express, { Response } from 'express';

import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isSuperUserCheck } from '../middleware/userRoleMiddleware';
import { enrichCurrentUser } from '../middleware/usersMiddleware';
import {
  assignApiParticipantMemberRole,
  queryKeycloakUsersByEmail,
  resetUserPassword,
  sendInviteEmailToNewUser,
} from '../services/kcUsersService';
import {
  getCurrentUser,
  getDefaultParticipant,
  KeycloakRequestSchema,
} from '../services/userService';
import { KeycloakRequest, UserRequest } from '../services/usersService';

const handleGetCurrentUser = async (req: UserRequest, res: Response) => {
  const user = await getCurrentUser(req);
  return res.json(user);
};

const handleGetDefaultParticipant = async (req: UserRequest, res: Response) => {
  const participant = await getDefaultParticipant(req);
  return res.json(participant);
};

const handleAcceptTerms = async (req: UserRequest, res: Response) => {
  const doesUserHaveAParticipant = (req.user?.participants?.length ?? 0) >= 1;

  if (!doesUserHaveAParticipant) {
    res.status(403).json({
      message: 'Unauthorized. You do not have the necessary permissions.',
      errorHash: req.headers.traceId,
    });
  }

  const kcAdminClient = await getKcAdminClient();
  const promises = [
    req.user!.$query().patch({ acceptedTerms: true }),
    assignApiParticipantMemberRole(kcAdminClient, req.user?.email!),
  ];
  await Promise.all(promises);
  return res.sendStatus(200);
};

const checkKeycloakQueryResult = (resultLength: number, email: string): void => {
  if (resultLength !== 1) {
    const error = new AxiosError();
    error.status = 400;
    if (resultLength < 1) {
      error.message = `No results received when loading user entry for ${email}`;
    } else if (resultLength > 1) {
      error.message = `Multiple results received when loading user entry for ${email}`;
    }
    throw error;
  }
};

const handleSelfResendInvitation = async (req: KeycloakRequest, res: Response) => {
  const { email } = KeycloakRequestSchema.parse(req.body);
  // const logger = LoggerService.getLogger(req);
  const { infoLogger, errorLogger } = getLoggers();
  const traceId = getTraceId(req);
  const kcAdminClient = await getKcAdminClient();
  const user = await queryKeycloakUsersByEmail(kcAdminClient, email);

  checkKeycloakQueryResult(user?.length ?? 0, email);

  infoLogger.info(`Resending invitation email for ${email}, keycloak ID ${user[0].id}`, traceId);
  // logger.info(`Resending invitation email for ${email}, keycloak ID ${user[0].id}`);
  await sendInviteEmailToNewUser(kcAdminClient, user[0]);
  return res.sendStatus(200);
};

const handleResetPassword = async (req: KeycloakRequest, res: Response) => {
  const { email } = KeycloakRequestSchema.parse(req.body);
  // const logger = this.loggerService.getLogger(req);
  const { infoLogger, errorLogger } = getLoggers();
  const traceId = getTraceId(req);
  const kcAdminClient = await getKcAdminClient();
  const user = await queryKeycloakUsersByEmail(kcAdminClient, email);

  checkKeycloakQueryResult(user?.length ?? 0, email);

  infoLogger.info(`Setting password update for ${email}, keycloak ID ${user[0].id}`, traceId);
  await resetUserPassword(kcAdminClient, user[0]);
  res.sendStatus(200);
};

const createUsersRouter = () => {
  const usersRouter = express.Router();

  usersRouter.use('/current', enrichCurrentUser);
  usersRouter.get('/current', handleGetCurrentUser);
  usersRouter.get('/current/participant', handleGetDefaultParticipant);
  usersRouter.put('/current/acceptTerms', handleAcceptTerms);
  usersRouter.post('/selfResendInvitation', handleSelfResendInvitation);
  usersRouter.post('/resetPassword', isSuperUserCheck, handleResetPassword);

  return usersRouter;
};

export { createUsersRouter };
