import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { User } from '../entities/User';
import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { UserParticipantRequest } from '../services/participantsService';
import { findUserByEmail, UserRequest } from '../services/usersService';

export const isUid2Support = async (userEmail: string) => {
  const user = await findUserByEmail(userEmail);
  const userWithUid2SupportRole = await UserToParticipantRole.query()
    .where('userId', '=', user!.id)
    .andWhere('userRoleId', '=', UserRoleId.UID2Support)
    .first();
  return !!userWithUid2SupportRole;
};

export const isUserBelongsToParticipant = async (
  email: string,
  participantId: number,
  traceId: string
) => {
  const userWithParticipants = await User.query()
    .findOne({ email, deleted: 0 })
    .modify('withParticipants');

  if (!userWithParticipants) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`User with email ${email} not found`, traceId);
    return false;
  }
  for (const participant of userWithParticipants.participants!) {
    if (participant.id === participantId) {
      return true;
    }
  }
  return false;
};

const canUserAccessParticipant = async (
  requestingUserEmail: string,
  participantId: number,
  traceId: string
) => {
  const isRequestingUserUid2Support = await isUid2Support(requestingUserEmail);

  return (
    isRequestingUserUid2Support ||
    (await isUserBelongsToParticipant(requestingUserEmail, participantId, traceId))
  );
};

export const enrichCurrentUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  const userEmail = req.auth?.payload?.email as string;
  const user = await findUserByEmail(userEmail);
  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  req.user = user;
  return next();
};

const userIdParser = z.object({
  userId: z.coerce.number(),
});

export const verifyAndEnrichUser = async (
  req: UserParticipantRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = userIdParser.parse(req.params);
  const { participant } = req;
  const traceId = getTraceId(req);
  const targetUser = await User.query().findById(userId).modify('withParticipants');

  if (!targetUser) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  if (targetUser.participants?.length === 0) {
    return res.status(404).send([{ message: 'The participant for that user cannot be found.' }]);
  }

  const targetUserBelongsToParticipant = await isUserBelongsToParticipant(
    targetUser.email,
    participant!.id,
    traceId
  );
  if (!targetUserBelongsToParticipant) {
    const { infoLogger } = getLoggers();
    infoLogger.info('Target user does not belong to participant', traceId);
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }

  const requestingUserEmail = req.auth?.payload?.email as string;
  const canRequestingUserAccessParticipant = await canUserAccessParticipant(
    requestingUserEmail,
    participant!.id,
    traceId
  );
  if (!canRequestingUserAccessParticipant) {
    return res.status(403).send([{ message: 'You do not have permission to that user account.' }]);
  }

  req.user = targetUser;
  return next();
};
