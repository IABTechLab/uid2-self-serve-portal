import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useMemo, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { Dialog } from '../Core/Dialog';
import { SortableTableHeader } from '../Core/SortableTableHeader';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharingParticipants: AvailableParticipantDTO[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
};

function NoParticipant() {
  return (
    <div className='no-participants-container'>
      <img src='/group-icon.svg' alt='group-icon' />
      <div className='no-participants-text'>
        <h2>No Participants</h2>
        <span>You don&apos;t have any sharing permissions yet.</span>
      </div>
    </div>
  );
}

export function SharingPermissionsTable({
  sharingParticipants,
  onDeleteSharingPermission,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<Set<number>>(new Set());
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState(sharingParticipants);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(Array.from(checkedParticipants));
    setCheckedParticipants(new Set());
    setOpenConfirmation(false);
  };

  const selectedParticipantList = useMemo(() => {
    return sharingParticipants.filter((p) => checkedParticipants.has(p.siteId!));
  }, [checkedParticipants, sharingParticipants]);

  const handleCheckboxChange = () => {
    if (selectAllState === TriStateCheckboxState.unchecked) {
      setCheckedParticipants(new Set(filteredParticipants.map((p) => p.siteId!)));
    } else {
      setCheckedParticipants(new Set());
    }
  };

  const isSelectedAll = useMemo(() => {
    if (!filteredParticipants.length) return false;
    return filteredParticipants.every((p) => checkedParticipants.has(p.siteId!));
  }, [filteredParticipants, checkedParticipants]);

  useEffect(() => {
    if (isSelectedAll) {
      setSelectAllState(TriStateCheckboxState.checked);
    } else if (checkedParticipants.size > 0) {
      setSelectAllState(TriStateCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(TriStateCheckboxState.unchecked);
    }
  }, [checkedParticipants.size, isSelectedAll]);

  const deletePermissionBtn = (
    <Dialog
      title='Are you sure you want to delete these permissions?'
      triggerButton={
        <button className='transparent-button sharing-permission-delete-button' type='button'>
          <FontAwesomeIcon
            icon={['far', 'trash-can']}
            className='sharing-permission-trashcan-icon'
          />
          Delete Permissions({selectedParticipantList.length})
        </button>
      }
      open={openConfirmation}
      onOpenChange={setOpenConfirmation}
    >
      <div className='dialog-body-section'>
        <ul className='dot-list'>
          {selectedParticipantList.map((participant) => (
            <li key={participant.id}>{participant.name}</li>
          ))}
        </ul>
        <p>Note: Sharing will continue with participants that are shared via &quot;Auto&quot;.</p>
      </div>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleDeletePermissions}>
          I want to Remove Permissions
        </button>
        <button
          type='button'
          className='transparent-button'
          onClick={() => setOpenConfirmation(false)}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );

  const tableHeader = () => (
    <>
      <SortableTableHeader<AvailableParticipantDTO> sortKey='name' header='Participant Name' />
      <th>Participant Type</th>
      <th>Added By</th>
    </>
  );

  return (
    <div className='sharing-permissions-table'>
      <h2>Your Sharing Permissions</h2>
      <div className='sharing-permissions-table-header-container'>
        <div className='sharing-permission-actions'>
          <TriStateCheckbox
            onClick={handleCheckboxChange}
            status={selectAllState}
            className='participant-checkbox'
          />
          {checkedParticipants.size > 0 && deletePermissionBtn}
        </div>
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
      </div>
      <ParticipantsTable
        showAddedByColumn
        participants={sharingParticipants}
        filterText={filterText}
        selectedParticipantIds={checkedParticipants}
        onSelectedChange={setCheckedParticipants}
        tableHeader={tableHeader}
        onFilteredParticipantChanged={setFilteredParticipants}
        className='shared-participants-table'
        hideSelectAllCheckbox
      />
      {!sharingParticipants.length && <NoParticipant />}
    </div>
  );
}
