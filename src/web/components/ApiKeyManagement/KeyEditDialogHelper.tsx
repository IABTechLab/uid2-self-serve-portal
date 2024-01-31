import { ApiRoleDTO } from '../../../api/entities/ApiRole';

export function getUnapprovedRoles(
  apiRoles: ApiRoleDTO[],
  allowedApiRoles: ApiRoleDTO[]
): ApiRoleDTO[] {
  const allowedApiRolesId = allowedApiRoles.map((role) => role.id);
  return apiRoles.filter((role) => !allowedApiRolesId.includes(role.id));
}
