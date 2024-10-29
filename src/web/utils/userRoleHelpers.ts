import { UserRoleId } from '../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../api/services/usersService';

export const isUserAdminOrSupport = (
  user: UserWithParticipantRoles,
  participantId: number
): boolean => {
  const userRolesForCurrentParticipant = user.participants?.find(
    (p) => p.id === participantId
  )?.currentUserRoleIds;
  const isAdminOrSupport =
    user.isUid2Support || userRolesForCurrentParticipant?.includes(UserRoleId.Admin);
  return isAdminOrSupport ?? false;
};
