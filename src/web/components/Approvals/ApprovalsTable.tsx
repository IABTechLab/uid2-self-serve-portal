import { Participant } from '../../../api/entities/Participant';
import { ApprovalItem } from './ApprovalItem';

import './ApprovalsTable.scss';

type ApprovalsTableProps = {
  participants: Participant[];
};

function NoApprovals() {
  return (
    <div className='no-approvals-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div className='no-approvals-text'>
        <h2>No Participant Requests</h2>
        <span>There are no participants that are awaiting approval.</span>
      </div>
    </div>
  );
}

export function ApprovalsTable({ participants }: ApprovalsTableProps) {
  return (
    <div className='approvals-container'>
      <table className='approvals-table'>
        <thead>
          <tr>
            <th>Participant Name</th>
            <th>Participant Type</th>
            <th>Participant Status</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => (
            <ApprovalItem key={participant.id} participant={participant} />
          ))}
        </tbody>
      </table>
      {!participants.length && <NoApprovals />}
    </div>
  );
}
