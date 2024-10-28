import { UserRoleId } from '../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../api/services/usersService';

export const isUserAdminOrSupport = (
  user: UserWithParticipantRoles,
  participantId: number
): boolean => {
  const userRolesForCurrentParticipant = user.participants?.find(
    (p) => p.id === participantId
  )?.currentUserRoleIds;
  return (
    user.isUid2Support ||
    [UserRoleId.UID2Support, UserRoleId.Admin].some((role) =>
      userRolesForCurrentParticipant?.includes(role)
    )
  );
};
