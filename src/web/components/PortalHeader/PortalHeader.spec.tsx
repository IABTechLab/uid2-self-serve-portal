import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Participant, ParticipantDTO } from '../../../api/entities/Participant';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import {
  createParticipantContextValue,
  createUserContextValue,
  TestContextProvider,
} from '../../../testHelpers/testContextProvider';
import { UserContextWithSetter } from '../../contexts/CurrentUserProvider';
import { ParticipantWithSetter } from '../../contexts/ParticipantProvider';
import { PortalHeader } from './PortalHeader';
import * as stories from './PortalHeader.stories';
import { UserRoleId } from '../../../api/entities/UserRole';

const { InvalidEmailAddress, NoEmailAddress } = composeStories(stories);

const renderPortalHeaderWithContext = (
  userContextValue: UserContextWithSetter,
  participantContextValue: ParticipantWithSetter
) => {
  return render(
    <TestContextProvider
      userContextValue={userContextValue}
      participantContextValue={participantContextValue}
    >
      <PortalHeader email='test@example.com' fullName='Test Name' logout={() => {}} />
    </TestContextProvider>
  );
};

describe('Portal Header tests', () => {
  test('when an invalid email address is provided, a home link is still displayed', async () => {
    render(<InvalidEmailAddress />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/home'));
  });

  test('when no email is provided, the dropdown text shows that there is no logged in user', async () => {
    render(<NoEmailAddress />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Not logged in');
  });

  describe('Audit Trail in Portal Header tests based on role', () => {
    const user = userEvent.setup();
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

      await user.click(dropdownMenuButton);

      const auditTrailMenuItem = screen.getByRole('menuitem', { name: 'Audit Trail' });
      expect(auditTrailMenuItem).toBeInTheDocument();
    });

    it('should not show Audit Trail when user does not have uid2support role', async () => {
      mockUser.isUid2Support = false;
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');
      await user.click(dropdownMenuButton);
      expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
    });

    const teamMemberManageRoles = [
      { id: UserRoleId.UID2Support, roleName: 'UID2Support' },
      { id: UserRoleId.Admin, roleName: 'Admin' },
    ];
    it.each(teamMemberManageRoles)(
      'should show Audit Trail in dropdown menu when user has UID2Support or Admin roles for the participant',
      async (manageRole) => {
        mockUser.isUid2Support = false;
        mockUser.currentParticipantUserRoles = [manageRole];
        userContextValue = createUserContextValue(mockUser);
        renderPortalHeaderWithContext(userContextValue, participantContextValue);
        const dropdownMenuButton = screen.getByRole('button');
        await user.click(dropdownMenuButton);
        expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
      }
    );

    it('should not show Audit Trail in dropdown menu when user has Operations role for the participant', async () => {
      mockUser.isUid2Support = false;
      mockUser.currentParticipantUserRoles = [
        { id: UserRoleId.Operations, roleName: 'Operations' },
      ];
      userContextValue = createUserContextValue(mockUser);
      renderPortalHeaderWithContext(userContextValue, participantContextValue);
      const dropdownMenuButton = screen.getByRole('button');
      await user.click(dropdownMenuButton);
      expect(screen.queryByRole('menuitem', { name: 'Audit Trail' })).not.toBeInTheDocument();
    });
  });
});
