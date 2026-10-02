import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { Participant, ParticipantDTO } from '../../../api/entities/Participant';
import { UserRoleId } from '../../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import {
  createParticipantContextValue,
  createUserContextValue,
  TestContextProviderWithoutKeycloak,
} from '../../../testHelpers/testContextProvider';
import { UserContextWithSetter } from '../../contexts/CurrentUserProvider';
import { ParticipantWithSetter } from '../../contexts/ParticipantProvider';
import { IdentityConfigProvider, RawIdentityConfig } from '../../utils/identity';
import { PortalHeader } from './PortalHeader';
import * as stories from './PortalHeader.stories';

const uid2Config: RawIdentityConfig = {
  identity: 'UID2',
  productName: 'UID2',
  docsBaseUrl: 'https://unifiedid.com/docs/intro',
  logo: { light: '/uid2-logo.svg', dark: '/uid2-logo-darkmode.svg' },
};

const { InvalidEmailAddress, NoEmailAddress } = stories;

const renderPortalHeaderWithContext = (
  userContextValue: UserContextWithSetter,
  participantContextValue: ParticipantWithSetter
) => {
  return render(
    <TestContextProviderWithoutKeycloak
      userContextValue={userContextValue}
      participantContextValue={participantContextValue}
    >
      <IdentityConfigProvider value={uid2Config}>
        <PortalHeader email='test@example.com' fullName='Test Name' logout={() => {}} />
      </IdentityConfigProvider>
    </TestContextProviderWithoutKeycloak>
  );
};

describe('Portal Header tests', () => {
  it('when an invalid email address is provided, a home link is still displayed', async () => {
    render(
      <MemoryRouter>
        <IdentityConfigProvider value={uid2Config}>
          <PortalHeader {...InvalidEmailAddress.args} fullName='test' logout={() => {}} />
        </IdentityConfigProvider>
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/home'));
  });

  it('when no email is provided, the dropdown text shows that there is no logged in user', async () => {
    render(
      <MemoryRouter>
        <IdentityConfigProvider value={uid2Config}>
          <PortalHeader
            {...NoEmailAddress.args}
            email={undefined}
            fullName={undefined}
            logout={() => {}}
          />
        </IdentityConfigProvider>
      </MemoryRouter>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Not logged in');
  });

  describe('Audit Trail in Portal Header tests based on role', () => {
    let participantContextValue: ParticipantWithSetter;
    let userContextValue: UserContextWithSetter;
    let mockParticipant: ParticipantDTO;
    let mockUser: UserWithParticipantRoles;

    beforeAll(() => {
      mockParticipant = createMockParticipant();
      participantContextValue = createParticipantContextValue(mockParticipant);
      mockUser = createMockUser([mockParticipant] as Participant[]);
      userContextValue = createUserContextValue(mockUser);
    });

    it('should show Audit Trail when user has uid2support role', async () => {
      mockUser.isUid2Support = true;
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');

      const user = userEvent.setup();
      await user.click(dropdownMenuButton);

      const auditTrailMenuItem = screen.getByRole('menuitem', { name: 'Audit Trail' });
      expect(auditTrailMenuItem).toBeInTheDocument();
    });

    it('should not show Audit Trail when user does not have uid2support role', async () => {
      mockUser.isUid2Support = false;
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');

      const user = userEvent.setup();
      await user.click(dropdownMenuButton);

      expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
    });

    it('should show Audit Trail in dropdown menu when user has Admin role for the participant', async () => {
      mockUser.isUid2Support = false;
      mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Admin, roleName: 'Admin' }];
      userContextValue = createUserContextValue(mockUser);
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');

      const user = userEvent.setup();
      await user.click(dropdownMenuButton);

      expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
    });

    it('should not show Audit Trail in dropdown menu when user has Operations role for the participant', async () => {
      mockUser.isUid2Support = false;
      mockUser.currentParticipantUserRoles = [
        { id: UserRoleId.Operations, roleName: 'Operations' },
      ];
      userContextValue = createUserContextValue(mockUser);
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');
      const user = userEvent.setup();
      await user.click(dropdownMenuButton);
      expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
    });
  });
});
