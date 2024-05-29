/* eslint-disable camelcase */
import { faker } from '@faker-js/faker';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { shouldRotateApiKey, yearInSeconds } from './KeyHelper';

const Mapper: ApiRoleDTO = { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 };
const Generator: ApiRoleDTO = {
  id: 2,
  roleName: 'GENERATOR',
  externalName: 'Generator',
  order: 2,
};
const Bidder: ApiRoleDTO = {
  id: 3,
  roleName: 'ID_READER',
  externalName: 'Bidder',
  order: 4,
};
const Sharer: ApiRoleDTO = { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 };

const buildApiKey = (apiKey: Partial<ApiKeyDTO>): ApiKeyDTO => {
  return {
    contact: apiKey.contact ?? faker.string.alphanumeric(),
    name: apiKey.name ?? faker.string.alphanumeric(),
    created: apiKey.created ?? Number(faker.date.recent()),
    key_id: apiKey.key_id ?? faker.string.alphanumeric(),
    site_id: apiKey.site_id ?? faker.number.int(),
    disabled: apiKey.disabled ?? false,
    roles: apiKey.roles ?? [Mapper, Generator, Bidder, Sharer],
    service_id: apiKey.service_id ?? faker.number.int(),
  };
};

describe('test if api key needs rotating', () => {
  const dayInSeconds = 60 * 60 * 24;

  it('should return false if the API key is disabled even if older than one year', () => {
    const apiKey = {
      created: Math.floor(Date.now() / 1000) - yearInSeconds - dayInSeconds,
      disabled: true,
    };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(false);
  });

  it('should return true if the API key is disabled and key is less than one year old', () => {
    const apiKey = { created: Math.floor(Date.now() / 1000) - dayInSeconds, disabled: true };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(false);
  });

  it('should return true if the API key is older than one year', () => {
    const apiKey = { created: Math.floor(Date.now() / 1000) - yearInSeconds - dayInSeconds };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(true);
  });

  it('should return true if the API key is much older than one year (created 3 years ago)', () => {
    const apiKey = { created: Math.floor(Date.now() / 1000) - yearInSeconds * 3 };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(true);
  });

  it('should return false if the API key is less than one year (365 days) old (created 100 days ago)', () => {
    const apiKey = { created: Math.floor(Date.now() / 1000) - dayInSeconds * 100 };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(false);
  });

  it('should return false when the API key is just created', () => {
    const apiKey = { created: Math.floor(Date.now() / 1000) };
    expect(shouldRotateApiKey(buildApiKey(apiKey))).toBe(false);
  });
});
