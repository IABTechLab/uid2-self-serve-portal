import { ApiRoleDTO } from '../../api/entities/ApiRole';

export function sortApiRoles(apiRoles: ApiRoleDTO[]) {
  apiRoles.sort((a, b) => (a.order > b.order ? 1 : -1));

  return apiRoles;
}
