import { render, screen } from '@testing-library/react';
import {
  createParticipantContextValue,
  createUserContextValueWithParticipantRoleName,
  TestContextProvider,
} from '../../../testHelpers/testContextProvider';
import { UserContextWithSetter } from '../../contexts/CurrentUserProvider';
import { ParticipantWithSetter } from '../../contexts/ParticipantProvider';

import TeamMembersTable from './TeamMembersTable';
import { ParticipantDTO, Participant } from '../../../api/entities/Participant';
import { UserWithCurrentParticipantRoleNames } from '../../../api/services/usersService';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import { UserRoleId } from '../../../api/entities/UserRole';

const renderTeamMembersTableWithContext = (
  userContextValue: UserContextWithSetter,
  participantContextValue: ParticipantWithSetter,
  teamMembers: UserWithCurrentParticipantRoleNames[]
) => {
  return render(
    <TestContextProvider
      userContextValue={userContextValue}
      participantContextValue={participantContextValue}
    >
      <TeamMembersTable
        teamMembers={teamMembers}
        onAddTeamMember={() => {
          return Promise.resolve();
        }}
        onRemoveTeamMember={() => {
          return Promise.resolve();
        }}
        onUpdateTeamMember={() => {
          return Promise.resolve();
        }}
        resendInvite={() => {
          return Promise.resolve();
        }}
      />
    </TestContextProvider>
  );
};

describe('manage team member functionality testing', () => {
  let participantContextValue: ParticipantWithSetter;
  let userContextValue: UserContextWithSetter;
  let mockParticipant: ParticipantDTO;
  let mockUser: UserWithCurrentParticipantRoleNames;
  beforeAll(() => {
    mockParticipant = createMockParticipant();
    participantContextValue = createParticipantContextValue(mockParticipant);
    mockUser = createMockUser([mockParticipant] as Participant[]);
  });

  const teamMemberManageRoles = [
    { id: UserRoleId.UID2Support, roleName: 'UID2Support' },
    { id: UserRoleId.Admin, roleName: 'Admin' },
  ];
  it.each(teamMemberManageRoles)(
    'should include all manage team member functionality',
    (manageRole) => {
      mockUser.currentParticipantUserRoles = [manageRole];
      userContextValue = createUserContextValueWithParticipantRoleName(mockUser);
      renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
      const addTeamMemberButton = screen.getByRole('button', { name: 'Add Team Member' });
      expect(addTeamMemberButton).toBeInTheDocument();
      const actionsHeader = screen.getByRole('columnheader', { name: 'Actions' });
      expect(actionsHeader).toBeInTheDocument();
      expect(screen.getByTestId('action-cell')).toBeInTheDocument();
    }
  );

  it('should not include any manage team member functionality', () => {
    mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Operations, roleName: 'Operations' }];
    userContextValue = createUserContextValueWithParticipantRoleName(mockUser);
    renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
    expect(screen.queryByRole('button', { name: 'Add Team Member' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('action-cell')).not.toBeInTheDocument();
  });
});
