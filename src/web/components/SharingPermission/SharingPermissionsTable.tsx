import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';
import { SearchAndAddParticipants } from './searchAndAddParticipantsDialog';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharedParticipants: ParticipantPayload[];
  onSharingPermissionsAdded: () => void;
};

function NoParticipant() {
  return (
    <div className='no-participants-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div className='no-participants-text'>
        <h1>No Participants</h1>
        <span>You don&apos;t have any sharing permissions yet.</span>
      </div>
    </div>
  );
}
export function SharingPermissionsTable({
  sharedParticipants,
  onSharingPermissionsAdded,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!selectAll) {
      setCheckedParticipants([]);
    } else {
      setCheckedParticipants(sharedParticipants.map((p) => p.id!));
    }
  }, [selectAll, sharedParticipants]);

  const handleSelectedChange = (selectedItems: number[]) => {
    if (selectedItems.length > 0 && selectedItems.length === sharedParticipants.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setCheckedParticipants(selectedItems);
  };

  return (
    <div className='sharing-permissions-table'>
      <div className='sharing-permissions-table-header-container'>
        <h1>Your Sharing Permission</h1>
        <div className='sharing-permission-actions'>
          <div className='sharing-permissions-search-bar-container'>
            <input
              type='text'
              className='sharing-permissions-search-bar'
              onChange={(event) => setFilterText(event.target.value)}
              placeholder='Search sharing permissions'
              value={filterText}
            />
            <FontAwesomeIcon icon='search' className='sharing-permission-search-bar-icon' />
          </div>
          <SearchAndAddParticipants onSharingPermissionsAdded={onSharingPermissionsAdded} />
        </div>
      </div>
      <ParticipantsTable
        participants={sharedParticipants}
        filterText={filterText}
        selectedParticipant={checkedParticipants}
        onSelectedChange={handleSelectedChange}
        className='shared-participants-table'
      >
        <tr>
          <th>
            <input
              type='checkbox'
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
              id='select-all-checkbox'
              className='participant-checkbox'
            />
          </th>
          <th>Participant Name</th>
          <th>Participant Type</th>
        </tr>
      </ParticipantsTable>
      {!sharedParticipants.length && <NoParticipant />}
    </div>
  );
}
