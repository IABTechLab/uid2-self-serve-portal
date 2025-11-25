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

  const authClient = {
    authenticated: true,
    hasRealmRole(_ignored: string) {
      return true;
    },
    hasResourceRole(_ignored: string) {
      return true;
    },
    loadUserProfile() {
      return Promise.resolve(userProfile);
    },
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateToken: () => Promise.resolve(true),
    idToken: token,
    profile: userProfile,
    realm: 'TestRealm',
    realmAccess,
    refreshToken: token,
    token,
  } as Keycloak;
  return { initialized: true, keycloak: authClient };
}
