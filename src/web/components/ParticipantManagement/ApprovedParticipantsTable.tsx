import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UpdateParticipantForm } from '../../services/participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { ApprovedParticipantItem } from './ApprovedParticipantItem';

import './ParticipantManagementTable.scss';

type ApprovedParticipantsTableProps = {
  participants: ParticipantDTO[];
  apiRoles: ApiRoleDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
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

export function ApprovedParticipantsTable({
  participants,
  apiRoles,
  onUpdateParticipant,
}: ApprovedParticipantsTableProps) {
  return (
    <div className='approved-participant-container'>
      <h2>All Participants</h2>
      <table className='approved-participants-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>Participant Type</th>
            <th>API Roles</th>
            <th className='action'>Action</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => (
            <ApprovedParticipantItem
              key={participant.id}
              participant={participant}
              apiRoles={apiRoles}
              onUpdateParticipant={onUpdateParticipant}
            />
          ))}
        </tbody>
      </table>
      {!participants.length && <NoParticipants />}
    </div>
  );
}
