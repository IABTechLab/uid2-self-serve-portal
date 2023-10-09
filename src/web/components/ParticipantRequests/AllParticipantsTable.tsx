import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { ParticipantRequestItem } from './ParticipantRequestItem';

import './ParticipantRequestsTable.scss';

type ParticipantRequestsTableProps = {
  participantRequests: ParticipantRequestDTO[];
  participantTypes: ParticipantTypeDTO[];
  onApprove: (participantId: number, formData: ParticipantApprovalFormDetails) => Promise<void>;
};

function NoParticipantRequests() {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/group-icon.svg' alt='group-icon' />}
      title='No Participant Requests'
    >
      <span>There are no participants that are awaiting approval.</span>
    </TableNoDataPlaceholder>
  );
}

export function AllParticipantsTable({
  participantRequests,
  participantTypes,
  onApprove,
}: ParticipantRequestsTableProps) {
  return (
    <div className='participant-requests-container'>
      <table className='participant-requests-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>Participant Type</th>
            <th>Allowed API Roles</th>
            <th>Name of Approver</th>
            <th>Date of Approval</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {participantRequests.map((participantRequest) => (
            <ParticipantRequestItem
              key={participantRequest.id}
              participantRequest={participantRequest}
              participantTypes={participantTypes}
              onApprove={onApprove}
            />
          ))}
        </tbody>
      </table>
      {!participantRequests.length && <NoParticipantRequests />}
    </div>
  );
}
