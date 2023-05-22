import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharedParticipants: ParticipantPayload[];
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
export function SharingPermissionsTable({ sharedParticipants }: SharingPermissionsTableProps) {
  const [filter, setFilter] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setCheckedParticipants([]);
    } else {
      setCheckedParticipants(sharedParticipants.map((p) => p.id!));
    }
  };

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
        <div className='sharing-permissions-search-bar-container'>
          <input
            type='text'
            className='sharing-permissions-search-bar'
            onChange={(event) => setFilter(event.target.value)}
            placeholder='Search sharing permissions'
            value={filter}
          />
          <FontAwesomeIcon icon='search' className='sharing-permission-search-bar-icon' />
        </div>
      </div>
      <ParticipantsTable
        participants={sharedParticipants}
        filter={filter}
        selectedParticipant={checkedParticipants}
        onSelectedChange={handleSelectedChange}
        className='shared-participants-table'
      >
        <tr>
          <th>
            <input
              type='checkbox'
              checked={selectAll}
              onChange={handleSelectAllChange}
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
