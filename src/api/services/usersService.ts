import { Request } from 'express';

import { Participant } from '../entities/Participant';
import { User, UserDTO } from '../entities/User';
import { ADMIN_USER_ROLE_ID } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { isUserAnApprover } from './approversService';

export interface UserRequest extends Request {
  user?: User;
}

export interface SiteRequest extends Request {
  siteId?: number;
}

export interface SelfResendInviteRequest extends Request {
  email?: string;
}

export type UserWithIsApprover = User & { isApprover: boolean };

export const findUserByEmail = async (email: string) => {
  return User.query()
    .findOne('email', email)
    .where('deleted', 0)
    .modify('withParticipants')
    .withGraphFetched('userToParticipantRoles');
};

export const enrichUserWithIsApprover = async (user: User) => {
  const userIsApprover = await isUserAnApprover(user.email);
  return {
    ...user,
    isApprover: userIsApprover,
  };
};

// TODO: Update this method so that if an existing user is invited, it will still add the new participant + mapping.
export const createUserInPortal = async (
  user: Omit<UserDTO, 'id' | 'acceptedTerms'>,
  participantId: number
) => {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) return existingUser;
  await User.transaction(async (trx) => {
    const newUser = await User.query(trx).insert(user);
    // Update the user/participant/role mapping
    await UserToParticipantRole.query(trx).insert({
      userId: newUser?.id,
      participantId,
      userRoleId: ADMIN_USER_ROLE_ID,
    });
  });
};

export const getAllUserFromParticipant = async (participant: Participant) => {
  return participant.$relatedQuery('users').where('deleted', 0).castTo<User[]>();
};
