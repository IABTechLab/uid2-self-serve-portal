import * as cloak from '@react-keycloak/web';
import { render, screen } from '@testing-library/react';

import * as keycloakMocks from '../../testHelpers/keycloakMocks';
import { TestContextProvider } from '../../testHelpers/testContextProvider';
import { App } from '../App';

// Needed to enable spying on useKeyCloak
jest.mock('@react-keycloak/web', () => ({
  __esModule: true,
  ...jest.requireActual('@react-keycloak/web'),
}));

jest.mock('../components/Core/PortalHeader', () => ({
  __esModule: true,
  PortalHeader: () => {
    throw new Error('mock error');
  },
}));

describe('Error handler', () => {
  beforeEach(() => {
    jest
      .spyOn(cloak, 'useKeycloak')
      .mockImplementation(() => keycloakMocks.mockAuthenticatedKeycloak());
  });

  test('handles gracefully for uncaught exceptions', async () => {
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
  });
});
