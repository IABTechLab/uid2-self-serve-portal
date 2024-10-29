import { UserWithParticipantRoles } from '../../../api/services/usersService';

export const validateUniqueTeamMemberEmail = (
  value: string,
  existingTeamMembers: UserWithParticipantRoles[]
) => {
  if (existingTeamMembers.filter((t) => t.email === value).length > 0) {
    return false;
  }
  return true;
};
