import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { Participant } from '../entities/Participant';
import { User, UserDTO } from '../entities/User';
import { getLoggers, getTraceId } from '../helpers/loggingHelpers';
import { isUserAnApprover } from './approversService';

export type UserWithIsApprover = User & { isApprover: boolean };

export const findUserByEmail = async (email: string) => {
  return User.query().findOne('email', email).where('deleted', 0);
};

export const enrichUserWithIsApprover = async (user: User) => {
  const userIsApprover = await isUserAnApprover(user.email);
  return {
    ...user,
    isApprover: userIsApprover,
  };
};

export const createUserInPortal = async (
  user: Omit<UserDTO, 'id' | 'acceptedTerms'>,
  participantId: number
) => {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) return existingUser;
  const newUser = await User.query().insert(user);
  // Update the user <-> participant mapping
  await newUser.$relatedQuery('participant').relate(participantId);
};

export const isUserBelongsToParticipant = async (
  email: string,
  participantId: number,
  traceId: string
) => {
  const user = await User.query()
    .findOne({ email, deleted: 0 })
    .whereExists(User.relatedQuery('participant').where('participant.id', participantId));
  if (!user) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Denied access to participant ID ${participantId} by user ${email}`, traceId);
  }
  return !!user;
};

export interface UserRequest extends Request {
  user?: User;
}

export interface SiteRequest extends Request {
  siteId?: number;
}

export interface SelfResendInviteRequest extends Request {
  email?: string;
}

const userIdParser = z.object({
  userId: z.coerce.number(),
});

export const enrichCurrentUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  const userEmail = req.auth?.payload?.email as string;
  const user = await findUserByEmail(userEmail);
  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }
  req.user = user;
  return next();
};

export const enrichWithUserFromParams = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = userIdParser.parse(req.params);
  const user = await User.query().findById(userId);
  if (!user) {
    return res.status(404).send([{ message: 'The user cannot be found.' }]);
  }

  req.user = user;
  return next();
};

export const getAllUserFromParticipant = async (participant: Participant) => {
  return participant.$relatedQuery('users').castTo<User[]>();
};
