import { ApiRoleDTO } from '../../../api/entities/ApiRole';

export function getAllowedRoles(apiRoleAllowedLists: ApiRoleDTO[][]): ApiRoleDTO[] {
  const possibleRolesMap = new Map<number, ApiRoleDTO>();
  apiRoleAllowedLists.map((apiRoles) =>
    apiRoles.map((apiRole) => possibleRolesMap.set(apiRole.id, apiRole))
  );

  return Array.from(possibleRolesMap.values());
}
