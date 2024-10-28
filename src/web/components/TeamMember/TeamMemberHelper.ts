import { UserResponse } from '../../services/userAccount';

export const validateUniqueTeamMemberEmail = (
  value: string,
  existingTeamMembers: UserResponse[]
) => {
  if (existingTeamMembers.filter((t) => t.email === value).length > 0) {
    return false;
  }
  return true;
};
