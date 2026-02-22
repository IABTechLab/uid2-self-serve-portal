import express, { Response } from 'express';

import { UserRoleId } from '../entities/UserRole';
import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { getKcAdminClient } from '../keycloakAdminClient';
import { isAdminOrUid2SupportCheck } from '../middleware/userRoleMiddleware';
import { verifyAndEnrichUser } from '../middleware/usersMiddleware';
import { queryKeycloakUsersByEmail, sendInviteEmailToNewUser } from '../services/kcUsersService';
import { UserParticipantRequest } from '../services/participantsService';
import { removeUser, updateUser, UpdateUserRoleIdSchema } from '../services/userService';
import { getAllUsersFromParticipant, UserRequest } from '../services/usersService';

const handleUpdateUser = async (req: UserRequest, res: Response) => {
  const { user } = req;
  const userRoleData = UpdateUserRoleIdSchema.parse(req.body);
  if (req.auth?.payload?.email === user?.email && userRoleData.userRoleId !== UserRoleId.Admin) {
    res
      .status(403)
      .send([{ message: 'You do not have permission to unassign the Admin role from yourself.' }]);
    return;
  }
  await updateUser(req);
  return res.sendStatus(200);
};

const handleRemoveUser = async (req: UserParticipantRequest, res: Response) => {
  const { user, participant } = req;
  if (req.auth?.payload?.email === user?.email) {
    res.status(403).send([{ message: 'You do not have permission to remove yourself.' }]);
    return;
  }
  const usersForParticipant = await getAllUsersFromParticipant(participant!);
  if (usersForParticipant.length === 1 && usersForParticipant[0].id === user?.id) {
    res.status(403).send([{ message: "You cannot remove a Participant's only user." }]);
    return;
  }

  await removeUser(req);
  return res.sendStatus(200);
};

const handleResendInvitation = async (req: UserRequest, res: Response) => {
  const { infoLogger, errorLogger } = getLoggers();
  const traceId = getTraceId(req);
  const kcAdminClient = await getKcAdminClient();
  const user = await queryKeycloakUsersByEmail(kcAdminClient, req.user?.email ?? '');

  const resultLength = user?.length ?? 0;
  if (resultLength < 1) {
    return res.sendStatus(404);
  }
  if (resultLength > 1) {
    errorLogger.error(
      `Multiple results received when loading user entry for ${req.user?.email}`,
      traceId
    );
    return res.sendStatus(500);
  }

  infoLogger.info(
    `Resending invitation email for ${req.user?.email}, keycloak ID ${user[0].id}`,
    traceId
  );
  await sendInviteEmailToNewUser(kcAdminClient, user[0]);
  return res.sendStatus(200);
};

const createParticipantUsersRouter = () => {
  const participantUsersRouter = express.Router({ mergeParams: true });

  participantUsersRouter.use('/:userId', verifyAndEnrichUser);
  participantUsersRouter.post(
    '/:userId/resendInvitation',
    isAdminOrUid2SupportCheck,
    handleResendInvitation
  );
  participantUsersRouter.patch('/:userId', isAdminOrUid2SupportCheck, handleUpdateUser);
  participantUsersRouter.delete('/:userId', isAdminOrUid2SupportCheck, handleRemoveUser);

  return participantUsersRouter;
};

export { createParticipantUsersRouter };
