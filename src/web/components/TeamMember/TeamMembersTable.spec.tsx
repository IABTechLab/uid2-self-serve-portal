import { render, screen } from '@testing-library/react';

import { Participant, ParticipantDTO } from '../../../api/entities/Participant';
import { UserRoleId } from '../../../api/entities/UserRole';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import {
  createParticipantContextValue,
  createUserContextValue,
  TestContextProvider,
} from '../../../testHelpers/testContextProvider';
import { UserContextWithSetter } from '../../contexts/CurrentUserProvider';
import { ParticipantWithSetter } from '../../contexts/ParticipantProvider';
import TeamMembersTable from './TeamMembersTable';

const renderTeamMembersTableWithContext = (
  userContextValue: UserContextWithSetter,
  participantContextValue: ParticipantWithSetter,
  teamMembers: UserWithParticipantRoles[]
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
  let mockUser: UserWithParticipantRoles;
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
      // setting uid2 support to false to make sure the roles are tested
      mockUser.isUid2Support = false;
      mockUser.currentParticipantUserRoles = [manageRole];
      mockParticipant.currentUserRoleIds = [manageRole.id];
      userContextValue = createUserContextValue(mockUser);
      renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
      const addTeamMemberButton = screen.getByRole('button', { name: 'Add Team Member' });
      expect(addTeamMemberButton).toBeInTheDocument();
      const actionsHeader = screen.getByRole('columnheader', { name: 'Actions' });
      expect(actionsHeader).toBeInTheDocument();
      expect(screen.getByLabelText('Edit Team Member')).toBeInTheDocument();
    }
  );

  it('should not include any manage team member functionality', () => {
    mockUser.isUid2Support = false;
    mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Operations, roleName: 'Operations' }];
    mockParticipant.currentUserRoleIds = [UserRoleId.Operations];
    userContextValue = createUserContextValue(mockUser);
    renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
    expect(screen.queryByRole('button', { name: 'Add Team Member' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit Team Member')).not.toBeInTheDocument();
  });

  it('should include all manage team member functionality when user has uid2support', () => {
    mockUser.isUid2Support = true;
    userContextValue = createUserContextValue(mockUser);
    renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
    const addTeamMemberButton = screen.getByRole('button', { name: 'Add Team Member' });
    expect(addTeamMemberButton).toBeInTheDocument();
    const actionsHeader = screen.getByRole('columnheader', { name: 'Actions' });
    expect(actionsHeader).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Team Member')).toBeInTheDocument();
  });

  it('should not include any manage team member functionality when user does not have uid2support', () => {
    mockUser.isUid2Support = false;
    userContextValue = createUserContextValue(mockUser);
    renderTeamMembersTableWithContext(userContextValue, participantContextValue, [mockUser]);
    expect(screen.queryByRole('button', { name: 'Add Team Member' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit Team Member')).not.toBeInTheDocument();
  });
});
