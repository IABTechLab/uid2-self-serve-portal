import { ApiRoleDTO } from '../../api/entities/ApiRole';

export function sortApiRoles(apiRoles: ApiRoleDTO[]) {
  apiRoles.sort((a, b) => (a.order > b.order ? 1 : -1));

  return apiRoles;
}

export function getRoleNamesByIds(ids: number[]) {
  const names: string[] = ids.map((item) => {
    switch (item) {
      case 1:
        return 'Mapper';
      case 2:
        return 'Generator';
      case 3:
        return 'Bidder';
      case 4:
        return 'Sharer';
      default:
        return 'Invalid';
    }
  });
  return names;
}
