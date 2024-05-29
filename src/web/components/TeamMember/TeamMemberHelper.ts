import { UserDTO } from "../../../api/entities/User";

export const validateUniqueTeamMemberEmail = (
  value: string,
  existingTeamMembers: UserDTO[] | undefined
) => {
  if (existingTeamMembers && existingTeamMembers?.filter((t) => t.email === value).length > 0) {
    return 'Please enter a team member email that does not already exist.';
  }
  return true;
};
