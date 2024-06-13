import { UserDTO } from '../../../api/entities/User';

export const validateUniqueTeamMemberEmail = (value: string, existingTeamMembers: UserDTO[]) => {
  if (existingTeamMembers.filter((t) => t.email === value).length > 0) {
    return false;
  }
  return true;
};
