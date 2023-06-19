import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { SelectAllCheckbox, SelectAllCheckboxState } from '../Core/SelectAllCheckbox';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharingParticipants: ParticipantResponse[];
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
  sharingParticipants,
  onDeleteSharingPermission,
  children,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<number[]>([]);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    SelectAllCheckboxState.unchecked
  );
  const [filteredParticipants, setFilteredParticipants] =
    useState<ParticipantResponse[]>(sharingParticipants);

  const isSelectedAll = useMemo(() => {
    if (!filteredParticipants.length) return false;
    const selected = new Set(checkedParticipants);
    return filteredParticipants.every((p) => selected.has(p.siteId!));
  }, [filteredParticipants, checkedParticipants]);

  const hasParticipantSelected = useMemo(
    () => checkedParticipants.length > 0,
    [checkedParticipants]
  );

  useEffect(() => {
    if (isSelectedAll) {
      setSelectAllState(SelectAllCheckboxState.checked);
    } else if (hasParticipantSelected) {
      setSelectAllState(SelectAllCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(SelectAllCheckboxState.unchecked);
    }
  }, [hasParticipantSelected, isSelectedAll]);

  const handleSelectAll = () => {
    setCheckedParticipants(filteredParticipants.map((p) => p.siteId!));
  };

  const handleUnselectAll = () => {
    setCheckedParticipants([]);
  };

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(checkedParticipants);
    handleUnselectAll();
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
        participants={sharingParticipants}
        filterText={filterText}
        selectedParticipant={checkedParticipants}
        onSelectedChange={setCheckedParticipants}
        filteredParticipants={filteredParticipants}
        className={clsx('shared-participants-table', { selected: hasParticipantSelected })}
        onFilteredParticipantChange={setFilteredParticipants}
      >
        <tr>
          <th>
            <SelectAllCheckbox
              onSelectAll={handleSelectAll}
              onUnselect={handleUnselectAll}
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
      {!sharingParticipants.length && <NoParticipant />}
    </div>
  );
}
