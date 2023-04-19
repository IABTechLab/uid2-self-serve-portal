import * as cloak from '@react-keycloak/web';
import { render, screen } from '@testing-library/react';
import * as axios from 'axios';

import { mockBackendError } from '../../testHelpers/dataMocks';
import * as keycloakMocks from '../../testHelpers/keycloakMocks';
import { TestContextProvider } from '../../testHelpers/testContextProvider';
import { App } from '../App';
import * as Header from '../components/Core/PortalHeader';
import { CurrentUserProvider } from '../contexts/CurrentUserProvider';
import { PortalErrorBoundary } from './PortalErrorBoundary';

// Needed to enable spying on useKeyCloak
jest.mock('@react-keycloak/web', () => ({
  __esModule: true,
  ...jest.requireActual('@react-keycloak/web'),
}));

describe('Error boundary', () => {
  beforeEach(() => {
    jest
      .spyOn(cloak, 'useKeycloak')
      .mockImplementation(() => keycloakMocks.mockAuthenticatedKeycloak());
  });

  test('does not show error boundary when there are no errors', async () => {
    render(
      <TestContextProvider>
        <App />
      </TestContextProvider>
    );
    expect(await screen.findByText('Not logged in')).toBeInTheDocument();
  });

  test('shows error boundary for uncaught js exceptions', async () => {
    const portalSpy = jest.spyOn(Header, 'PortalHeader').mockImplementation(() => {
      throw new Error('mock error');
    });
    render(
      <TestContextProvider>
        <App />
      </TestContextProvider>
    );
    expect(
      await screen.findByText(
        'Unexpected error encountered, please contact support if the problem persists and provide the information below'
      )
    ).toBeInTheDocument();
    portalSpy.mockRestore();
  });

  test('shows error boundary for uncaught api exceptions', async () => {
    jest
      .spyOn(axios.default, 'get')
      .mockRejectedValueOnce(mockBackendError({ status: 500, errorHash: '123' }));

    render(
      <TestContextProvider>
        <PortalErrorBoundary>
          <CurrentUserProvider>
            <App />
          </CurrentUserProvider>
        </PortalErrorBoundary>
      </TestContextProvider>
    );
    expect(await screen.findByText('(error hash: 123)')).toBeInTheDocument();
  });
});
