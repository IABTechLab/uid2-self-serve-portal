import { render } from '@testing-library/react';

import * as keycloakMocks from '../../testHelpers/keycloakMocks';
import * as KeycloakProvider from '../contexts/KeycloakProvider';
import { LogoutRoute } from './logout';

// Needed to enable spying on useKeycloak
jest.mock('../contexts/KeycloakProvider', () => ({
  __esModule: true,
  ...jest.requireActual('../contexts/KeycloakProvider'),
}));

describe('Logout', () => {
  let kcMock: jest.SpyInstance;
  let logoutSpy: jest.Mock;

  beforeEach(() => {
    logoutSpy = jest.fn(() => Promise.resolve());
    const mockKeycloak = keycloakMocks.mockAuthenticatedKeycloak();
    // Override logout on the Keycloak-typed object rather than rebuilding it via spread, which
    // would drop the class's method members and no longer satisfy the Keycloak type.
    mockKeycloak.keycloak.logout = logoutSpy;
    kcMock = jest.spyOn(KeycloakProvider, 'useKeycloak').mockImplementation(() => ({
      ...mockKeycloak,
      authenticated: true,
    }));
  });

  afterEach(() => {
    kcMock.mockRestore();
  });

  // Regression test for UID2-7444: an invitee's email redirects to /logout, a PrivateRoute.
  // Since ee45cbd3, PrivateRoute sends unauthenticated users back to log into their current
  // path, so calling keycloak.logout() with no redirectUri (which then defaults to /logout)
  // traps the user: /logout logs them out, PrivateRoute redirects them to log in again, and
  // logging in lands them right back on /logout. Passing redirectUri: window.location.origin
  // sends them to the site root instead, breaking the cycle while preserving the UID2-1579
  // session-teardown behavior.
  it('logs out to the site root so it does not loop back to /logout', () => {
    render(LogoutRoute.element);

    expect(logoutSpy).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
