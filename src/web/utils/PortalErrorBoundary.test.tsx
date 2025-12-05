import { render, screen } from '@testing-library/react';
import * as axios from 'axios';

import { mockBackendError } from '../../testHelpers/errorMocks';
import * as keycloakMocks from '../../testHelpers/keycloakMocks';
import { App } from '../App';
import * as Loading from '../components/Core/Loading/Loading';
import { CurrentUserProvider } from '../contexts/CurrentUserProvider';
import * as KeycloakProvider from '../contexts/KeycloakProvider';
import { PortalErrorBoundary } from './PortalErrorBoundary';

// Needed to enable spying on useKeycloak
jest.mock('../contexts/KeycloakProvider', () => ({
  __esModule: true,
  ...jest.requireActual('../contexts/KeycloakProvider'),
}));

describe('Error boundary', () => {
  let kcMock: jest.SpyInstance;
  beforeEach(() => {
    kcMock = jest
      .spyOn(KeycloakProvider, 'useKeycloak')
      .mockImplementation(() => ({
        ...keycloakMocks.mockAuthenticatedKeycloak(),
        authenticated: true,
      }));
  });

  afterEach(() => {
    kcMock.mockRestore();
  });

  it('does not show error boundary when there are no errors', () => {
    render(
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error boundary for uncaught js exceptions', () => {
    const portalSpy = jest.spyOn(Loading, 'Loading').mockImplementation(() => {
      throw new Error('mock error');
    });
    // throwing the mock error spams the console with expected error stacks.  This keeps it clean.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <PortalErrorBoundary>
        <Loading.Loading />
      </PortalErrorBoundary>
    );
    expect(
      screen.getByText('There was an unexpected error. Please try again.')
    ).toBeInTheDocument();
    errorSpy.mockRestore();
    portalSpy.mockRestore();
  });

  // this test needs more work
  test.skip('shows error boundary for uncaught api exceptions', async () => {
    jest
      .spyOn(axios.default, 'get')
      .mockRejectedValueOnce(mockBackendError({ status: 500, errorHash: '123' }));

    render(
      <PortalErrorBoundary>
        <CurrentUserProvider>
          <Loading.Loading />
        </CurrentUserProvider>
      </PortalErrorBoundary>
    );
    expect(await screen.findByText('(error hash: 123)')).toBeInTheDocument();
  });
});
