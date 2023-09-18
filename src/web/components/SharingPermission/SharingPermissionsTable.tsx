import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import {
  ClientType,
  ClientTypeDescriptions,
  ClientTypes,
} from '../../../api/services/adminServiceHelpers';
import { useAllSitesList } from '../../services/site';
import { formatStringsWithSeparator } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { MultiSelectDropdown } from '../Core/MultiSelectDropdown';
import { SortableTableHeader } from '../Core/SortableTableHeader';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantsTable } from './ParticipantsTable';
import {
  filterSites,
  getSelectAllState,
  isAddedByManual,
  isSelectedAll,
  MANUALLY_ADDED,
  SharingParticipant,
} from './ParticipantTableHelper';

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
  selectedSiteList: SharingSiteWithSource[];
};
function DeletePermissionDialog({
  onDeleteSharingPermission,
  selectedSiteList,
}: DeletePermissionDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDeletePermissions = () => {
    onDeleteSharingPermission();
    setOpenConfirmation(false);
  };

  const showDeletionNotice = (participant: SharingSiteWithSource) => {
    const remainSources = participant.addedBy.filter((source) => source !== MANUALLY_ADDED);
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
          {selectedSiteList.map((participant) => (
            <li key={participant.id}>
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
  sharingSites: SharingSiteWithSource[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
};

export function SharingPermissionsTableContent({
  sharingSites,
  onDeleteSharingPermission,
}: SharingPermissionsTableContentProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedSites, setCheckedSites] = useState<Set<number>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set<ClientType>());
  const filteredSites = filterSites(sharingSites, filterText, selectedTypes);

  const isSelectedAllManualAddedParticipant = () => {
    return isSelectedAll(filteredSites.filter(isAddedByManual), checkedSites);
  };

  const checkboxStatus = getSelectAllState(isSelectedAllManualAddedParticipant(), checkedSites);

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(Array.from(checkedSites));
    setCheckedSites(new Set());
  };
  const siteTypeOptions = ClientTypes.map((type) => ({
    id: type,
    name: ClientTypeDescriptions[type],
  }));

  const handleCheckboxChange = () => {
    if (checkboxStatus === TriStateCheckboxState.unchecked) {
      const selectedSiteIds = new Set<number>();
      filteredSites.forEach((site) => {
        if (isAddedByManual(site)) selectedSiteIds.add(site.id);
      });
      setCheckedSites(selectedSiteIds);
    } else {
      setCheckedSites(new Set());
    }
  };

  const tableHeader = (
    <thead>
      <tr className='participant-item-with-checkbox'>
        <th> </th>
        <SortableTableHeader<SharingParticipant> sortKey='name' header='Participant Name' />
        <th>Participant Type</th>
        <SortableTableHeader<SharingParticipant> sortKey='addedBy' header='Source' />
      </tr>
    </thead>
  );

  return (
    <>
      <div className='sharing-permissions-table-header-container'>
        <div className='sharing-permission-actions'>
          <TriStateCheckbox
            onClick={handleCheckboxChange}
            status={checkboxStatus}
            className='participant-checkbox'
          />
          {checkedSites.size > 0 && (
            <DeletePermissionDialog
              onDeleteSharingPermission={handleDeletePermissions}
              selectedSiteList={sharingSites.filter((p) => checkedSites.has(p.id))}
            />
          )}
          <MultiSelectDropdown
            title='Participant Type'
            options={siteTypeOptions}
            onSelectedChange={setSelectedTypes}
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
      <ParticipantsTable
        sites={filteredSites}
        selectedParticipantIds={checkedSites}
        onSelectedChange={setCheckedSites}
        tableHeader={tableHeader}
        className='shared-participants-table'
      />
    </>
  );
}

type SharingPermissionsTableProps = {
  sharedSiteIds: number[];
  sharedTypes: ClientType[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
};

export function SharingPermissionsTable({
  sharedSiteIds,
  sharedTypes,
  onDeleteSharingPermission,
}: SharingPermissionsTableProps) {
  const { sites, isLoading } = useAllSitesList();
  const getSharingParticipants: () => SharingSiteWithSource[] = () => {
    return sites!
      .map((p) => {
        const maybeManualArray: typeof MANUALLY_ADDED[] = sharedSiteIds.includes(p.id)
          ? [MANUALLY_ADDED]
          : [];
        const includedTypes =
          p.clientTypes?.filter((partTypes) => sharedTypes.includes(partTypes)) ?? [];
        return {
          ...p,
          addedBy: [...includedTypes, ...maybeManualArray],
        };
      })
      .filter((site) => site.addedBy.length > 0);
  };

  if (isLoading) return <Loading />;
  const sharingParticipants = getSharingParticipants();
  console.log('SHARED', sharedSiteIds, sharedTypes);
  console.log('-------------', sites, sharingParticipants);
  return (
    <div className='sharing-permissions-table'>
      <h2>Your Sharing Permissions</h2>
      {sharingParticipants.length ? (
        <SharingPermissionsTableContent
          sharingSites={getSharingParticipants()}
          onDeleteSharingPermission={onDeleteSharingPermission}
        />
      ) : (
        <NoParticipant />
      )}
    </div>
  );
}
