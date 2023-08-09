import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ReactNode, useMemo, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { Dialog } from '../Core/Dialog';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

type SharingPermissionsTableProps = {
  sharingParticipants: AvailableParticipantDTO[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
  children?: ReactNode;
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
  children,
}: SharingPermissionsTableProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<Set<number>>(new Set());
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const hasParticipantSelected = checkedParticipants.size > 0;

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(Array.from(checkedParticipants));
    setCheckedParticipants(new Set());
    setOpenConfirmation(false);
  };

  const selectedParticipantList = useMemo(() => {
    return sharingParticipants.filter((p) => checkedParticipants.has(p.siteId!));
  }, [checkedParticipants, sharingParticipants]);

  const tableHeader = () =>
    !hasParticipantSelected ? (
      <>
        <th>Participant Name</th>
        <th>Participant Type</th>
        <th>Added By</th>
      </>
    ) : (
      <th colSpan={3}>
        <Dialog
          title='Are you sure you want to delete these permissions?'
          triggerButton={
            <button className='transparent-button sharing-permission-delete-button' type='button'>
              <FontAwesomeIcon
                icon={['far', 'trash-can']}
                className='sharing-permission-trashcan-icon'
              />
              Delete Permissions
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
            <p>
              Note: Sharing will continue with participants that are shared via &quot;Auto&quot;.
            </p>
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
      </th>
    );

  return (
    <div className='sharing-permissions-table'>
      <div className='sharing-permissions-table-header-container'>
        <h2>Your Sharing Permissions</h2>
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
        onSelectedChange={setCheckedParticipants}
        tableHeader={tableHeader}
        hideCheckboxIfNoItem
        className={clsx('shared-participants-table', { selected: hasParticipantSelected })}
      />
      {!sharingParticipants.length && <NoParticipant />}
    </div>
  );
}
