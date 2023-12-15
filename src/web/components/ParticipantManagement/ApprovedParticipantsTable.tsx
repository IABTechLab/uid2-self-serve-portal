import { ParticipantDTO } from '../../../api/entities/Participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { ApprovedParticipantItem } from './ApprovedParticipantItem';

import './ParticipantManagementTable.scss';

type ApprovedParticipantsTableProps = {
  participants: ParticipantDTO[];
};

function NoParticipants() {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/group-icon.svg' alt='group-icon' />}
      title='No Approved Participants'
    >
      <span>There are no approved participants.</span>
    </TableNoDataPlaceholder>
  );
}

export function ApprovedParticipantsTable({ participants }: ApprovedParticipantsTableProps) {
  return (
    <div className='approved-participant-container'>
      <h2>All Participants</h2>
      <table className='approved-participants-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>Participant Type</th>
            <th>API Roles</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => (
            <ApprovedParticipantItem key={participant.id} participant={participant} />
          ))}
        </tbody>
      </table>
      {!participants.length && <NoParticipants />}
    </div>
  );
}
