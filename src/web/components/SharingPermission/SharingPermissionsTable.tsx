import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharingParticipants: ParticipantResponse[];
  children?: ReactNode;
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
  sharingParticipants,
  children,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!selectAll) {
      setCheckedParticipants([]);
    } else {
      setCheckedParticipants(sharingParticipants.map((p) => p.id!));
    }
  }, [selectAll, sharingParticipants]);

  const handleSelectedChange = (selectedItems: number[]) => {
    if (selectedItems.length > 0 && selectedItems.length === sharingParticipants.length) {
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
          {children}
        </div>
      </div>
      <ParticipantsTable
        participants={sharingParticipants}
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
      {!sharingParticipants.length && <NoParticipant />}
    </div>
  );
}
