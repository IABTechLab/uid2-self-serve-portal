import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import {
  ClientType,
  ClientTypeDescriptions,
  ClientTypes,
} from '../../../api/services/adminServiceHelpers';
import { useAllSitesList } from '../../services/site';
import ActionButton from '../Core/Buttons/ActionButton';
import { Loading } from '../Core/Loading/Loading';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { Tooltip } from '../Core/Tooltip/Tooltip';
import { MultiSelectDropdown } from '../Input/MultiSelectDropdown';
import { TriStateCheckbox, TriStateCheckboxState } from '../Input/TriStateCheckbox';
import { DeletePermissionDialog } from './DeletePermissionDialog';
import { ParticipantsTable } from './ParticipantsTable';
import {
  disableSelectAllCheckbox,
  filterSites,
  getSelectAllState,
  isAddedByManual,
  isSelectedAll,
  MANUALLY_ADDED,
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

type SharingPermissionsTableContentProps = Readonly<{
  sharingSites: SharingSiteWithSource[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
}>;

export function SharingPermissionsTableContent({
  sharingSites,
  onDeleteSharingPermission,
}: SharingPermissionsTableContentProps) {
  const [filterText, setFilterText] = useState('');
  const [checkedSites, setCheckedSites] = useState<Set<number>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set<ClientType>());
  const [showDeletePermissionsDialog, setShowDeletePermissionsDialog] = useState<boolean>(false);
  const filteredSites = filterSites(sharingSites, filterText, selectedTypes);

  const isSelectedAllManualAddedParticipant = () => {
    return isSelectedAll(filteredSites.filter(isAddedByManual), checkedSites);
  };

  const checkboxStatus = getSelectAllState(isSelectedAllManualAddedParticipant(), checkedSites);

  const handleDeletePermissions = (siteIdsToDelete: number[]) => {
    onDeleteSharingPermission(siteIdsToDelete);
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

  const selectAllCheckbox = (
    <TriStateCheckbox
      onClick={handleCheckboxChange}
      status={checkboxStatus}
      disabled={disableSelectAllCheckbox(filteredSites)}
    />
  );

  const onOpenChangeDeletePermissionsDialog = () => {
    setShowDeletePermissionsDialog(!showDeletePermissionsDialog);
  };

  const tableHeader = (
    <thead>
      <tr className='participant-item-with-checkbox'>
        <th> </th>
        <SortableTableHeader<SharingSiteWithSource> sortKey='name' header='Participant Name' />
        <th>Participant Type</th>
        <SortableTableHeader<SharingSiteWithSource> sortKey='addedBy' header='Source' />
        <th className='action'>Actions</th>
      </tr>
    </thead>
  );

  return (
    <>
      <div className='sharing-permissions-table-header-container'>
        <div className='sharing-permission-actions'>
          {disableSelectAllCheckbox(filteredSites) ? (
            <Tooltip trigger={selectAllCheckbox}>
              Gray indicates participants selected in bulk permissions. To update, adjust bulk
              permission settings.
            </Tooltip>
          ) : (
            selectAllCheckbox
          )}
          {checkedSites.size > 0 && (
            <ActionButton
              className='sharing-permission-delete-button'
              onClick={onOpenChangeDeletePermissionsDialog}
              icon={['far', 'trash-can']}
              iconClassName='sharing-permission-trashcan-icon'
            >
              Delete Permissions
            </ActionButton>
          )}
          {showDeletePermissionsDialog && checkedSites.size > 0 && (
            <DeletePermissionDialog
              onDeleteSharingPermission={handleDeletePermissions}
              selectedSiteList={sharingSites.filter((p) => checkedSites.has(p.id))}
              onOpenChange={onOpenChangeDeletePermissionsDialog}
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
        onDelete={handleDeletePermissions}
        sharingSites={sharingSites}
      />
    </>
  );
}

type SharingPermissionsTableProps = Readonly<{
  sharedSiteIds: number[];
  sharedTypes: ClientType[];
  onDeleteSharingPermission: (siteIds: number[]) => Promise<void>;
}>;

export function SharingPermissionsTable({
  sharedSiteIds,
  sharedTypes,
  onDeleteSharingPermission,
}: SharingPermissionsTableProps) {
  const { sites, isLoading } = useAllSitesList();
  const getSharingParticipants: () => SharingSiteWithSource[] = () => {
    return sites!
      .filter((p) => p.canBeSharedWith || sharedSiteIds.includes(p.id))
      .map((p) => {
        const maybeManualArray: (typeof MANUALLY_ADDED)[] = sharedSiteIds.includes(p.id)
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
