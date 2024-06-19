import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { UpdateParticipantForm } from '../../services/participant';
import { SortableTableHeader } from '../Core/SortableTableHeader';
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

function ApprovedParticipantsTableContent({
  participants,
  apiRoles,
  participantTypes,
  onUpdateParticipant,
}: ApprovedParticipantsTableProps) {
  const { sortData } = useSortable<ParticipantDTO>();
  const sortedParticipants = sortData(participants);

  return (
    <div className='approved-participant-container'>
      <h2>All Participants</h2>
      <table className='approved-participants-table'>
        <thead>
          <tr>
            <SortableTableHeader<ParticipantDTO> sortKey='name' header='Name' />
            <th>Participant Type</th>
            <SortableTableHeader<ParticipantDTO> sortKey='approver' header='Approver' />
            <SortableTableHeader<ParticipantDTO> sortKey='dateApproved' header='Date Approved' />
            <th>API Permissions</th>
            <SortableTableHeader<ParticipantDTO>
              sortKey='crmAgreementNumber'
              header='Salesforce Agreement Number'
            />
            <th className='action'>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedParticipants.map((participant) => (
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

export default function ApprovedParticipantsTable(props: ApprovedParticipantsTableProps) {
  return (
    <SortableProvider>
      <ApprovedParticipantsTableContent {...props} />
    </SortableProvider>
  );
}
