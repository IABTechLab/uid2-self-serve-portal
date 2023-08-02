import { ParticipantRequestDTO } from '../../../api/participantsRouter';
import { ParticipantRequestItem } from './ParticipantRequestItem';

import './ParticipantRequestsTable.scss';

type ParticipantRequestsTableProps = {
  participantRequests: ParticipantRequestDTO[];
};

function NoParticipantRequests() {
  return (
    <div className='no-participant-requests-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div className='no-participant-requests-text'>
        <h2>No Participant Requests</h2>
        <span>There are no participants that are awaiting approval.</span>
      </div>
    </div>
  );
}

export function ParticipantRequestsTable({ participantRequests }: ParticipantRequestsTableProps) {
  return (
    <div className='participant-requests-container'>
      <table className='participant-requests-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>Participant Type</th>
            <th>Participant Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {participantRequests.map((participantRequest) => (
            <ParticipantRequestItem
              key={participantRequest.id}
              participantRequest={participantRequest}
            />
          ))}
        </tbody>
      </table>
      {!participantRequests.length && <NoParticipantRequests />}
    </div>
  );
}
