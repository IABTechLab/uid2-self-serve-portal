import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { User } from '../entities/User';
import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { findUserByEmail, UserRequest } from '../services/usersService';

export const userHasUid2SupportRole = async (userEmail: string) => {
  const user = await findUserByEmail(userEmail);
  const hasUid2SupportRole = await UserToParticipantRole.query()
    .where('userId', '=', user!.id)
    .andWhere('userRoleId', '=', UserRoleId.UID2Support)
    .first();
  return !!hasUid2SupportRole;
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

export const enrichWithUserFromParams = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = userIdParser.parse(req.params);
  const traceId = getTraceId(req);
  const user = await User.query().findById(userId).modify('withParticipants');

  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  if (user.participants?.length === 0) {
    return res.status(404).send([{ message: 'The participant for that user cannot be found.' }]);
  }

  const requestingUserEmail = req.auth?.payload?.email as string;
  const requestingUserIsUid2Support = await userHasUid2SupportRole(requestingUserEmail);

  // TODO: This just gets the user's first participant, but it will need to get the currently selected participant as part of UID2-2822
  const firstParticipant = user.participants?.[0] as Participant;

  const requestingUserHasAccessToParticipant =
    requestingUserIsUid2Support ||
    (await isUserBelongsToParticipant(requestingUserEmail, firstParticipant.id, traceId));

  if (!requestingUserHasAccessToParticipant) {
    return res.status(403).send([{ message: 'You do not have permission to that user account.' }]);
  }

  req.user = user;
  return next();
};
