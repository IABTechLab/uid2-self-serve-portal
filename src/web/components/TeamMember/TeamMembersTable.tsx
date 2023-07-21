import {
  InviteTeamMemberForm,
  UpdateTeamMemberForm,
  UserResponse,
} from '../../services/userAccount';
import TeamMember from './TeamMember';
import TeamMemberDialog from './TeamMemberDialog';

import './TeamMembersTable.scss';

type TeamMembersTableProps = {
  teamMembers: UserResponse[];
  onAddTeamMember: (form: InviteTeamMemberForm) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
  resendInvite: (id: number) => Promise<void>;
};

function TeamMembersTable({
  teamMembers,
  onAddTeamMember,
  resendInvite,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: TeamMembersTableProps) {
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
        <TeamMemberDialog
          onAddTeamMember={onAddTeamMember}
          triggerButton={
            <button className='small-button' type='button'>
              Add team member
            </button>
          }
        />
      </div>
    </div>
  );
}

export default TeamMembersTable;
