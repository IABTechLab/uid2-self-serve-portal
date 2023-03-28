import { User, UserRole } from '../entities/User';

export const findUserByEmail = async (email: string) => {
  return User.query().findOne('email', email);
};
export const createUserInPortal = async (
  email: string,
  jobFunction: UserRole,
  participantId: string
) => {
  const user = findUserByEmail(email);
  if (user) return user;

  const userObject = {
    email,
    role: jobFunction,
    participantId,
  };
  return User.query().insert(userObject);
};
