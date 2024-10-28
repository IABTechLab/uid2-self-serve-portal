import { useContext, useEffect, useState } from 'react';

import { UserRoleId } from '../../../api/entities/UserRole';
import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import TeamMember from './TeamMember';
import TeamMemberDialog from './TeamMemberDialog';

import './TeamMembersTable.scss';

type TeamMembersTableProps = Readonly<{
  teamMembers: UserResponse[];
  onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
  resendInvite: (id: number, participantId: number) => Promise<void>;
}>;

function TeamMembersTableContent({
  teamMembers,
  onAddTeamMember,
  resendInvite,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: TeamMembersTableProps) {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const { participant } = useContext(ParticipantContext);
  const userRolesForCurrentParticipant = LoggedInUser?.user?.participants?.find(
    (p) => p.id === participant?.id
  )?.currentUserRoleIds;

  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>(false);
  const [showTeamMemberActions, setShowTeamMemberActions] = useState<boolean>(false);

  const onOpenChangeTeamMemberDialog = () => {
    setShowTeamMemberDialog(!showTeamMemberDialog);
  };

  const { sortData } = useSortable<UserResponse>();
  const sortedTeamMembers = sortData(teamMembers);

  useEffect(() => {
    const isUserAdminOrSupport =
      LoggedInUser?.user?.isUid2Support ||
      [UserRoleId.UID2Support, UserRoleId.Admin].some((role) =>
        userRolesForCurrentParticipant?.includes(role)
      );
    if (isUserAdminOrSupport) {
      setShowTeamMemberActions(true);
    }
  }, [LoggedInUser, teamMembers, userRolesForCurrentParticipant]);

  return (
    <div className='portal-team'>
      <table className='portal-team-table'>
        <thead>
          <tr>
            <SortableTableHeader<UserResponse> sortKey='firstName' header='Name' />
            <SortableTableHeader<UserResponse> sortKey='email' header='Email' />
            <SortableTableHeader<UserResponse> sortKey='jobFunction' header='Job Function' />
            <SortableTableHeader<UserResponse>
              sortKey='currentParticipantUserRoles'
              header='Roles'
            />
            {showTeamMemberActions && <th className='action'>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedTeamMembers.map((t) => (
            <TeamMember
              existingTeamMembers={teamMembers}
              key={t.email}
              person={t}
              resendInvite={resendInvite}
              onRemoveTeamMember={onRemoveTeamMember}
              onUpdateTeamMember={onUpdateTeamMember}
              showTeamMemberActions={showTeamMemberActions}
            />
          ))}
        </tbody>
      </table>
      {showTeamMemberActions && (
        <div className='add-team-member'>
          <button className='small-button' type='button' onClick={onOpenChangeTeamMemberDialog}>
            Add Team Member
          </button>
          {showTeamMemberDialog && (
            <TeamMemberDialog
              teamMembers={teamMembers}
              onAddTeamMember={onAddTeamMember}
              onOpenChange={onOpenChangeTeamMemberDialog}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function TeamMembersTable(props: TeamMembersTableProps) {
  return (
    <SortableProvider>
      <TeamMembersTableContent {...props} />
    </SortableProvider>
  );
}
