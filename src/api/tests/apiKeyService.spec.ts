import { ApiRoleDTO } from '../entities/ApiRole';
import { validateApiRoles } from '../services/apiKeyService';

describe('#validateApiRoles', () => {
  test('1 Valid Roles', () => {
    const keyRoles: string[] = ['MAPPER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);
    expect(result).toBe(true);
  });

  test('Multiple Valid Roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(true);
  });

  test('No Allowed Roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(false);
  });

  test('Some Allowed Roles', () => {
    const keyRoles: string[] = ['MAPPER', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(false);
  });
});
