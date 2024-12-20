import { User } from '../entities/User';
import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';

export const getAllUid2SupportUsers = async () => {
  const uid2SupportUserToParticipantRoles = await UserToParticipantRole.query()
    .distinct('userId')
    .where('userRoleId', UserRoleId.UID2Support);
  const uid2SupportUsers = await Promise.all(
    uid2SupportUserToParticipantRoles.map(async (user) => {
      return User.query().findOne('id', user.userId);
    })
  );
  return uid2SupportUsers.filter((user) => user !== undefined);
};
