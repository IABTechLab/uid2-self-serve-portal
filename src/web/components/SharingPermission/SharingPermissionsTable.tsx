import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { useAvailableSiteList } from '../../services/site';
import { formatStringsWithSeparator } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { MultiSelectDropdown } from '../Core/MultiSelectDropdown';
import { SortableTableHeader } from '../Core/SortableTableHeader';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { isAddedByManual, MANUALLY_ADDED, SharingParticipant } from './bulkAddPermissionsHelpers';
import { ParticipantsTable } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

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

type DeletePermissionDialogProps = {
  onDeleteSharingPermission: () => void;
  selectedParticipantList: SharingParticipant[];
};
function DeletePermissionDialog({
  onDeleteSharingPermission,
  selectedParticipantList,
}: DeletePermissionDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDeletePermissions = () => {
    onDeleteSharingPermission();
    setOpenConfirmation(false);
  };

  const showDeletionNotice = (participant: SharingParticipant) => {
    const remainSources = participant.addedBy.filter((source) => source !== 'Manually Added');
    if (remainSources.length) {
      return (
        <span> (This site will remain shared by {formatStringsWithSeparator(remainSources)})</span>
      );
    }
  };

  return (
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
            <li key={participant.siteId}>
              {participant.name}
              {showDeletionNotice(participant)}
            </li>
          ))}
        </ul>
      </div>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleDeletePermissions}>
          Delete Permissions
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
}

type SharingPermissionsTableContentProps = {
  sharingParticipants: SharingParticipant[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
  participantTypes: ParticipantTypeDTO[];
};

export function SharingPermissionsTableContent({
  sharingParticipants,
  onDeleteSharingPermission,
  participantTypes,
}: SharingPermissionsTableContentProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<Set<number>>(new Set());
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [filteredParticipants, setFilteredParticipants] = useState(sharingParticipants);

  const isSelectedAll = () => {
    if (!filteredParticipants.length || !checkedParticipants.size) return false;
    return filteredParticipants
      .filter(isAddedByManual)
      .every((p) => checkedParticipants.has(p.siteId!));
  };

  const getSelectAllState = () => {
    if (isSelectedAll()) {
      return TriStateCheckboxState.checked;
    }
    if (checkedParticipants.size > 0) {
      return TriStateCheckboxState.indeterminate as CheckedState;
    }
    return TriStateCheckboxState.unchecked;
  };

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(Array.from(checkedParticipants));
    setCheckedParticipants(new Set());
  };

  const participantTypeOptions = participantTypes.map((v) => ({ id: v.id, name: v.typeName }));

  const handleCheckboxChange = () => {
    if (getSelectAllState() === TriStateCheckboxState.unchecked) {
      const selectedSiteIds = new Set<number>();
      filteredParticipants.forEach((p) => {
        if (isAddedByManual(p)) selectedSiteIds.add(p.siteId);
      });
      setCheckedParticipants(selectedSiteIds);
    } else {
      setCheckedParticipants(new Set());
    }
  };

  const tableHeader = () => (
    <>
      <SortableTableHeader<SharingParticipant> sortKey='name' header='Participant Name' />
      <th>Participant Type</th>
      <SortableTableHeader<SharingParticipant> sortKey='addedBy' header='Source' />
    </>
  );

  return (
    <>
      <div className='sharing-permissions-table-header-container'>
        <div className='sharing-permission-actions'>
          <TriStateCheckbox
            onClick={handleCheckboxChange}
            status={getSelectAllState()}
            className='participant-checkbox'
          />
          {checkedParticipants.size > 0 && (
            <DeletePermissionDialog
              onDeleteSharingPermission={handleDeletePermissions}
              selectedParticipantList={sharingParticipants.filter((p) =>
                checkedParticipants.has(p.siteId!)
              )}
            />
          )}
          <MultiSelectDropdown
            title='Participant Type'
            options={participantTypeOptions}
            onSelectedChange={setSelectedTypeIds}
          />
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
      <ParticipantsTable<SharingParticipant>
        participants={sharingParticipants}
        filterText={filterText}
        selectedTypeIds={selectedTypeIds}
        selectedParticipantIds={checkedParticipants}
        onSelectedChange={setCheckedParticipants}
        tableHeader={tableHeader}
        className='shared-participants-table'
        onFilteredParticipantChanged={setFilteredParticipants}
        hideSelectAllCheckbox
      />
    </>
  );
}

type SharingPermissionsTableProps = {
  sharedSiteIds: number[];
  sharedTypes: string[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
  participantTypes: ParticipantTypeDTO[];
};

export function SharingPermissionsTable({
  sharedSiteIds,
  sharedTypes,
  onDeleteSharingPermission,
  participantTypes,
}: SharingPermissionsTableProps) {
  const { sites: availableParticipants, isLoading } = useAvailableSiteList();
  const getSharingParticipants = () => {
    const siteIds = new Set(sharedSiteIds);
    const sharedParticipantType = new Set(sharedTypes);
    const sharingLists: SharingParticipant[] = [];

    availableParticipants?.forEach((p) => {
      const sources = [];
      if (siteIds.has(p.siteId)) sources.push(MANUALLY_ADDED);
      p.types.forEach((t) => {
        if (sharedParticipantType.has(t.typeName.toLocaleUpperCase().replace(' ', '_'))) {
          sources.push(t.typeName);
        }
      });
      if (sources.length) {
        sharingLists.push({
          ...p,
          addedBy: sources,
        });
      }
    });
    return sharingLists;
  };
  const sharingParticipants = getSharingParticipants();

  if (isLoading) return <Loading />;
  return (
    <div className='sharing-permissions-table'>
      <h2>Your Sharing Permissions</h2>
      {sharingParticipants.length ? (
        <SharingPermissionsTableContent
          sharingParticipants={getSharingParticipants()}
          onDeleteSharingPermission={onDeleteSharingPermission}
          participantTypes={participantTypes}
        />
      ) : (
        <NoParticipant />
      )}
    </div>
  );
}
