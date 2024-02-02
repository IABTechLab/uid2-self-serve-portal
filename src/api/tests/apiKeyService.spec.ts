import { ApiRoleDTO } from '../entities/ApiRole';
import { validateApiRoles } from '../services/apiKeyService';

describe('#validateApiRoles', () => {
  test('Returns true if 1 valid role', () => {
    const keyRoles: string[] = ['MAPPER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);
    expect(result).toBe(true);
  });

  test('Returns true if multiple valid roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];
    const allowedRoles: ApiRoleDTO[] = [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
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
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
    ];

    const result = validateApiRoles(keyRoles, allowedRoles);

    expect(result).toBe(false);
  });
});
