import { useContext, useState } from 'react';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import { isUserAdminOrSupport } from '../../utils/userRoleHelpers';
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

  const showTeamMemberActions =
    (LoggedInUser?.user &&
      participant &&
      isUserAdminOrSupport(LoggedInUser?.user, participant.id)) ??
    false;

  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>(false);

  const onOpenChangeTeamMemberDialog = () => {
    setShowTeamMemberDialog(!showTeamMemberDialog);
  };

  const { sortData } = useSortable<UserResponse>();
  const sortedTeamMembers = sortData(teamMembers);

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
