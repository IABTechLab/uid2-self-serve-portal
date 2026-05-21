import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { docsBaseUrl, isEuid, isUid2, keycloakRealm, productName } from '../identity';

describe('identity helper', () => {
  const originalIdentity = process.env.SSP_PORTAL_IDENTITY;
  afterEach(() => {
    process.env.SSP_PORTAL_IDENTITY = originalIdentity;
  });

  describe('when SSP_PORTAL_IDENTITY is UID2 (default)', () => {
    beforeEach(() => {
      delete process.env.SSP_PORTAL_IDENTITY;
    });
    it('reports UID2', () => {
      expect(isUid2()).toBe(true);
      expect(isEuid()).toBe(false);
      expect(productName()).toBe('UID2');
      expect(docsBaseUrl()).toBe('https://unifiedid.com/docs/intro');
      expect(keycloakRealm()).toBe('self-serve-portal');
    });
  });

  describe('when SSP_PORTAL_IDENTITY is EUID', () => {
    beforeEach(() => {
      process.env.SSP_PORTAL_IDENTITY = 'EUID';
    });
    it('reports EUID', () => {
      expect(isEuid()).toBe(true);
      expect(isUid2()).toBe(false);
      expect(productName()).toBe('EUID');
      expect(docsBaseUrl()).toBe('https://euid.eu/docs/intro');
      expect(keycloakRealm()).toBe('euid-self-serve-portal');
    });
  });

  describe('when SSP_PORTAL_IDENTITY is unrecognised', () => {
    beforeEach(() => {
      process.env.SSP_PORTAL_IDENTITY = 'BOGUS';
    });
    it('throws on identity check', () => {
      expect(() => productName()).toThrow(/SSP_PORTAL_IDENTITY/);
    });
  });
});
