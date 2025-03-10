import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { SortableProvider } from '../../contexts/SortableTableProvider';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';

import './UserParticipantsTable.scss';

type UserParticipantRowProps = Readonly<{
  participantName?: string;
  roleName?: string;
}>;

function UserParticipantRow({ participantName, roleName }: UserParticipantRowProps) {
  return (
    <tr>
      <td className='participant-name'>{participantName ?? 'Cannot find participant name'}</td>
      <td className='role-name'>{roleName ?? 'Cannot find participant role'}</td>
    </tr>
  );
}

type UserParticipantsTableProps = Readonly<{
  user: UserDTO;
  userParticipants: ParticipantDTO[];
}>;

function UserParticipantsTableComponent({ user, userParticipants }: UserParticipantsTableProps) {
  return (
    <div className='users-participants-table-container'>
      <table className='users-participants-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>User Role</th>
          </tr>
        </thead>
        <tbody>
          {user.userToParticipantRoles?.map((role) => {
            return (
              <UserParticipantRow
                key={role.participantId}
                participantName={userParticipants.find((p) => p.id === role.participantId)?.name}
                roleName={UserRoleId[role.userRoleId]}
              />
            );
          })}
        </tbody>
      </table>
      {userParticipants.length === 0 && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No Participants'
        >
          <span>This user does not belong to any participant.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}

export default function UserParticipantsTable(props: UserParticipantsTableProps) {
  return (
    <SortableProvider>
      <UserParticipantsTableComponent {...props} />
    </SortableProvider>
  );
}
