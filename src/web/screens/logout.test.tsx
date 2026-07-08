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
    kcMock = jest.spyOn(KeycloakProvider, 'useKeycloak').mockImplementation(() => ({
      ...keycloakMocks.mockAuthenticatedKeycloak(),
      keycloak: {
        ...keycloakMocks.mockAuthenticatedKeycloak().keycloak,
        logout: logoutSpy,
      },
      authenticated: true,
    }));
  });

  afterEach(() => {
    kcMock.mockRestore();
  });

  // Regression test for UID2-7444: an invitee's email redirects to /logout, which is a
  // PrivateRoute. Since commit c867401b, PrivateRoute re-logs the user back into their
  // current path, so a logout with no redirectUri returns the browser to /logout and loops
  // forever. Passing redirectUri: window.location.origin sends the user to the site root
  // instead, breaking the loop while preserving the UID2-1579 session-teardown behavior.
  it('logs out to the site root so it does not loop back to /logout', () => {
    render(LogoutRoute.element);

    expect(logoutSpy).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    // The loop is only broken if the post-logout redirect leaves /logout. Guard against a
    // regression to the bare keycloak.logout() call, which defaults back to the current URL.
    expect(logoutSpy).not.toHaveBeenCalledWith();
  });
});
