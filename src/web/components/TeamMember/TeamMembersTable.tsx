import { useState } from 'react';

import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
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

function TeamMembersTable({
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

  return (
    <div className='portal-team'>
      <table className='portal-team-table'>
        <thead>
          <tr>
            <th className='name'>Name</th>
            <th className='email'>Email</th>
            <th className='jobFunction'>Job Function</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((t) => (
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

export default TeamMembersTable;
