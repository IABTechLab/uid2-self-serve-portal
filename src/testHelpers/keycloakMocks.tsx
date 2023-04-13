/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Keycloak, { KeycloakProfile } from 'keycloak-js';

export function mockAuthenticatedKeycloak() {
  const token = 'A random string that is non zero length';
  const userProfile: KeycloakProfile = {
    username: 'test_user',
    email: 'test_user@example.com',
    firstName: 'Test',
    lastName: 'User',
  };
  const realmAccess = { roles: ['user'] };

  const authClient: Keycloak = {
    authenticated: true,
    hasRealmRole(ignored: string) {
      return true;
    },
    hasResourceRole(ignored: string) {
      return true;
    },
    idToken: token,
    profile: userProfile,
    realm: 'TestRealm',
    realmAccess,
    refreshToken: token,
    token,
  } as Keycloak;
  return { initialized: true, keycloak: authClient };
}
