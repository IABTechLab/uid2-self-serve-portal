import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { User, UserDTO } from '../entities/User';

export const findUserByEmail = async (email: string) => {
  return User.query().findOne('email', email);
};

export const createUserInPortal = async (user: Omit<UserDTO, 'id' | 'acceptedTerms'>) => {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) return existingUser;
  return User.query().insert(user);
};

export const isUserBelongsToParticipant = async (email: string, participantId: number) => {
  const user = await User.query()
    .where('email', email)
    .andWhere('participantId', participantId)
    .first();

  return !!user;
};

export interface UserRequest extends Request {
  user?: User;
}

const userIdParser = z.object({
  userId: z.coerce.number(),
});

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

  if (!(await isUserBelongsToParticipant(req.auth?.payload?.email as string, user.participantId))) {
    return res.status(403).send([{ message: 'You do not have permission to that user account.' }]);
  }

  req.user = user;
  return next();
};
