import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { UpdateParticipantForm } from '../../services/participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { ApprovedParticipantItem } from './ApprovedParticipantItem';

import './ParticipantManagementTable.scss';

type ApprovedParticipantsTableProps = Readonly<{
  participants: ParticipantDTO[];
  apiRoles: ApiRoleDTO[];
  participantTypes: ParticipantTypeDTO[];
  onUpdateParticipant: (form: UpdateParticipantForm, participant: ParticipantDTO) => Promise<void>;
}>;

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
  participantTypes,
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
            <th>Approver</th>
            <th>Date Approved</th>
            <th>API Permissions</th>
            <th>Salesforce Agreement Number</th>
            <th className='action'>Action</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => (
            <ApprovedParticipantItem
              key={participant.id}
              participant={participant}
              participantTypes={participantTypes}
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
