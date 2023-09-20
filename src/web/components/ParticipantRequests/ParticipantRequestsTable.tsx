import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantApprovalFormDetails } from '../../services/participant';
import { ParticipantRequestItem } from './ParticipantRequestItem';

import './ParticipantRequestsTable.scss';

type ParticipantRequestsTableProps = {
  participantRequests: ParticipantRequestDTO[];
  participantTypes: ParticipantTypeDTO[];
  onApprove: (participantId: number, formData: ParticipantApprovalFormDetails) => Promise<void>;
};

function NoParticipantRequests() {
  return (
    <div className='no-table-data-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div>
        <h2>No Participant Requests</h2>
        <span>There are no participants that are awaiting approval.</span>
      </div>
    </div>
  );
}

export function ParticipantRequestsTable({
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
            <th>Participant Status</th>
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
