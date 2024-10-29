import { UserRoleId } from '../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../api/services/usersService';

const getUserRolesForParticipant = (user: UserWithParticipantRoles, participantId: number) => {
  return user.participants?.find((p) => p.id === participantId)?.currentUserRoleIds;
};

export const isUserAdminOrSupport = (
  user: UserWithParticipantRoles,
  participantId: number
): boolean => {
  const userRolesForCurrentParticipant = getUserRolesForParticipant(user, participantId);
  const isAdminOrSupport =
    user.isUid2Support || userRolesForCurrentParticipant?.includes(UserRoleId.Admin);
  return isAdminOrSupport ?? false;
};

export const isUserOperations = (
  user: UserWithParticipantRoles,
  participantId: number
): boolean => {
  const userRolesForCurrentParticipant = getUserRolesForParticipant(user, participantId);
  return userRolesForCurrentParticipant?.includes(UserRoleId.Operations) ?? false;
};
