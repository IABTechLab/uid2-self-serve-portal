import {
  allApiRoles,
  Generator,
  Mapper,
} from '../../web/components/ApiKeyManagement/KeyHelper.spec';
import { ApiRoleDTO } from '../entities/ApiRole';
import { validateApiRoles } from '../services/apiKeyService';

describe('#validateApiRoles', () => {
  test('Returns true if 1 valid role', () => {
    const keyRoles: string[] = ['MAPPER'];

    const result = validateApiRoles(keyRoles, allApiRoles);
    expect(result).toBe(true);
  });

  test('Returns true if multiple valid roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];

    const result = validateApiRoles(keyRoles, allApiRoles);

    expect(result).toBe(true);
  });

  test('Returns false if no allowed roles', () => {
    const keyRoles: string[] = ['MAPPER', 'GENERATOR', 'SHARER'];
    const noAllowedRoles: ApiRoleDTO[] = [];

    const result = validateApiRoles(keyRoles, noAllowedRoles);

    expect(result).toBe(false);
  });

  test('Returns false if only some valid roles', () => {
    const keyRoles: string[] = ['MAPPER', 'SHARER'];
    const someAllowedRoles: ApiRoleDTO[] = [Mapper, Generator];

    const result = validateApiRoles(keyRoles, someAllowedRoles);

    expect(result).toBe(false);
  });
});
