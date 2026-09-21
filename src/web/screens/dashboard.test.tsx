import { render, screen } from '@testing-library/react';

import { Participant, ParticipantDTO } from '../../api/entities/Participant';
import { createMockParticipant, createMockUser } from '../../testHelpers/dataMocks';
import {
  createParticipantContextValue,
  createUserContextValue,
  TestContextProviderWithoutKeycloak,
} from '../../testHelpers/testContextProvider';
import { IdentityConfigProvider, RawIdentityConfig } from '../utils/identity';
import { Dashboard } from './dashboard';

const makeConfig = (identity: 'UID2' | 'EUID'): RawIdentityConfig => ({
  identity,
  productName: identity,
  docsBaseUrl: '',
  logo: { light: '', dark: '' },
});

const renderDashboard = (identity: 'UID2' | 'EUID') => {
  const mockParticipant: ParticipantDTO = createMockParticipant();
  const participantContextValue = createParticipantContextValue(mockParticipant);
  const mockUser = createMockUser([mockParticipant] as Participant[]);
  const userContextValue = createUserContextValue(mockUser);

  return render(
    <TestContextProviderWithoutKeycloak
      participantContextValue={participantContextValue}
      userContextValue={userContextValue}
    >
      <IdentityConfigProvider value={makeConfig(identity)}>
        <Dashboard />
      </IdentityConfigProvider>
    </TestContextProviderWithoutKeycloak>
  );
};

describe('Dashboard route visibility', () => {
  it('hides Sharing Permissions, Team Members, Self-Reinvite on EUID', () => {
    renderDashboard('EUID');
    expect(screen.queryByText(/Sharing Permissions/i)).toBeNull();
    expect(screen.queryByText(/Team Members/i)).toBeNull();
    expect(screen.queryByText(/Reinvite/i)).toBeNull();
  });

  it('shows them on UID2', () => {
    renderDashboard('UID2');
    expect(screen.getByText(/Sharing Permissions/i)).toBeInTheDocument();
  });
});
