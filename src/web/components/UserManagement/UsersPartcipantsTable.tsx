import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import { UserRoleId } from '../../../api/entities/UserRole';
import { SortableProvider } from '../../contexts/SortableTableProvider';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';

import './UsersParticipantTable.scss';

type UsersParticipantRowProps = Readonly<{
  participantName?: string;
  roleName?: string;
}>;

function UsersParticipantRow({ participantName, roleName }: UsersParticipantRowProps) {
  return (
    <tr>
      <td className='participant-name'>{participantName ?? 'Cannot find participant name'}</td>
      <td className='role-name'>{roleName ?? 'Cannot find participant role'}</td>
    </tr>
  );
}

type UsersParticipantsTableProps = Readonly<{
  user: UserDTO;
  usersParticipants: ParticipantDTO[];
}>;

function UsersParticipantsTableComponent({ user, usersParticipants }: UsersParticipantsTableProps) {
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
              <UsersParticipantRow
                key={role.participantId}
                participantName={usersParticipants.find((p) => p.id === role.participantId)?.name}
                roleName={UserRoleId[role.userRoleId]}
              />
            );
          })}
        </tbody>
      </table>
      {usersParticipants.length === 0 && (
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

export default function UsersParticipantsTable(props: UsersParticipantsTableProps) {
  return (
    <SortableProvider>
      <UsersParticipantsTableComponent {...props} />
    </SortableProvider>
  );
}
