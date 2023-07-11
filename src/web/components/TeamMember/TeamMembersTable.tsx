import { InviteTeamMemberForm } from '../../services/participant';
import { UserResponse } from '../../services/userAccount';
import AddTeamMemberDialog from './AddTeamMemberDialog';
import TeamMember from './TeamMember';

import './TeamMembersTable.scss';

type TeamMembersTableProps = {
  teamMembers: UserResponse[];
  addTeamMember: (form: InviteTeamMemberForm, participantId: number) => Promise<void>;
  onTeamMembersUpdated: () => void;
  resendInvite: (id: number) => Promise<void>;
};

function TeamMembersTable({
  teamMembers,
  addTeamMember,
  onTeamMembersUpdated,
  resendInvite,
}: TeamMembersTableProps) {
  return (
    <div className='portal-team'>
      <table className='portal-team-table'>
        <thead>
          <tr>
            <th className='name'>Name</th>
            <th className='email'>Email</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((t) => (
            <TeamMember key={t.email} person={t} resendInvite={resendInvite} />
          ))}
        </tbody>
      </table>
      <div className='add-team-member'>
        <AddTeamMemberDialog
          onTeamMemberAdded={onTeamMembersUpdated}
          addTeamMember={addTeamMember}
        />
      </div>
    </div>
  );
}

export default TeamMembersTable;
