import { ApiRoleDTO } from '../entities/ApiRole';
import { validateApiRoles } from '../services/apiKeyService';

describe('Returns true if role(s) are valid', () => {
  test('Returns true if 1 valid role', () => {
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

  test('Returns true if multiple valid roles', () => {
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

  test('Returns false if no allowed roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(false);
  });

  test('Returns false if only some valid roles', () => {
    const keyRoles: string[] = ['MAPPER', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(false);
  });
});
