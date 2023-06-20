import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharedParticipants: ParticipantPayload[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
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
  sharedParticipants,
  onDeleteSharingPermission,
  children,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );

  useEffect(() => {
    if (
      checkedParticipants.length > 0 &&
      checkedParticipants.length === sharedParticipants.length
    ) {
      setSelectAllState(TriStateCheckboxState.checked);
    } else if (checkedParticipants.length > 0) {
      setSelectAllState(TriStateCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(TriStateCheckboxState.unchecked);
    }
  }, [checkedParticipants.length, sharedParticipants.length]);

  const handleCheckboxChange = () => {
    if (selectAllState === TriStateCheckboxState.unchecked) {
      setCheckedParticipants(sharedParticipants.map((p) => p.id!));
    } else {
      setCheckedParticipants([]);
    }
  };
  const hasParticipantSelected = useMemo(
    () => checkedParticipants.length > 0,
    [checkedParticipants]
  );

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(checkedParticipants);
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
        showAddedByColumn
        participants={sharedParticipants}
        filterText={filterText}
        selectedParticipant={checkedParticipants}
        onSelectedChange={setCheckedParticipants}
        className={clsx('shared-participants-table', { selected: hasParticipantSelected })}
      >
        <tr>
          <th>
            <TriStateCheckbox
              onClick={handleCheckboxChange}
              status={selectAllState}
              className='participant-checkbox'
            />
          </th>
          {!hasParticipantSelected ? (
            <>
              <th>Participant Name</th>
              <th>Participant Type</th>
              <th>Added By</th>
            </>
          ) : (
            <th colSpan={3}>
              <button
                className='transparent-button sharing-permission-delete-button'
                type='button'
                onClick={handleDeletePermissions}
              >
                <FontAwesomeIcon
                  icon={['far', 'trash-can']}
                  className='sharing-permission-trashcan-icon'
                />
                Delete Permissions
              </button>
            </th>
          )}
        </tr>
      </ParticipantsTable>
      {!sharedParticipants.length && <NoParticipant />}
    </div>
  );
}
