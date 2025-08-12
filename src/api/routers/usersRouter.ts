import express, { Response } from 'express';

import { getLoggers, getTraceId, TraceId } from '../helpers/loggingHelpers';
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

const checkKeycloakQueryResult = (
  resultLength: number,
  email: string,
  traceId: TraceId,
  res: Response,
  errorLogger: ReturnType<typeof getLoggers>['errorLogger']
) => {
  if (resultLength !== 1) {
    const message =
      resultLength < 1
        ? `No results received when loading user entry for ${email}`
        : `Multiple results received when loading user entry for ${email}`;
    errorLogger.error(message, traceId);
    return res.sendStatus(500);
  }
};

const handleSelfResendInvitation = async (req: KeycloakRequest, res: Response) => {
  const { email } = KeycloakRequestSchema.parse(req.body);
  const { infoLogger, errorLogger } = getLoggers();
  const traceId = getTraceId(req);
  const kcAdminClient = await getKcAdminClient();
  const user = await queryKeycloakUsersByEmail(kcAdminClient, email);

  checkKeycloakQueryResult(user?.length ?? 0, email, traceId, res, errorLogger);

  infoLogger.info(`Resending invitation email for ${email}, keycloak ID ${user[0].id}`, traceId);
  await sendInviteEmailToNewUser(kcAdminClient, user[0]);
  return res.sendStatus(200);
};

const handleResetPassword = async (req: KeycloakRequest, res: Response) => {
  const { email } = KeycloakRequestSchema.parse(req.body);
  const { infoLogger, errorLogger } = getLoggers();
  const traceId = getTraceId(req);
  const kcAdminClient = await getKcAdminClient();
  const user = await queryKeycloakUsersByEmail(kcAdminClient, email);

  checkKeycloakQueryResult(user?.length ?? 0, email, traceId, res, errorLogger);

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
