import { useState } from 'react';

import { UserDTO } from '../../../api/entities/User';
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
  resendInvite: (id: number) => Promise<void>;
}>;

function TeamMembersTableContent({
  teamMembers,
  onAddTeamMember,
  resendInvite,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: TeamMembersTableProps) {
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>(false);

  const onOpenChangeTeamMemberDialog = () => {
    setShowTeamMemberDialog(!showTeamMemberDialog);
  };

  const { sortData } = useSortable<UserDTO>();
  const sortedTeamMembers = sortData(teamMembers);

  return (
    <div className='portal-team'>
      <table className='portal-team-table'>
        <thead>
          <tr>
            <SortableTableHeader<UserResponse> sortKey='firstName' header='Name' />
            <SortableTableHeader<UserResponse> sortKey='email' header='Email' />
            <SortableTableHeader<UserResponse> sortKey='role' header='Job Function' />
            <th className='action'>Actions</th>
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
            />
          ))}
        </tbody>
      </table>
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
