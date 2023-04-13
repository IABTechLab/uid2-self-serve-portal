import { User, UserDTO } from '../entities/User';

export const findUserByEmail = async (email: string) => {
  return User.query().findOne('email', email);
};

export const createUserInPortal = async (user: Omit<UserDTO, 'id'>) => {
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
