import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useEffect, useMemo, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { useAvailableSiteList } from '../../services/site';
import { formatStringsWithSeparator } from '../../utils/textHelpers';
import { Dialog } from '../Core/Dialog';
import { Loading } from '../Core/Loading';
import { MultiSelectDropdown } from '../Core/MultiSelectDropdown';
import { SortableTableHeader } from '../Core/SortableTableHeader';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantsTable, SharingParticipant } from './ParticipantsTable';

import './SharingPermissionsTable.scss';

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
  const [filterText, setFilterText] = useState('');
  const [checkedParticipants, setCheckedParticipants] = useState<Set<number>>(new Set());
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const siteIds = useMemo(() => new Set(sharedSiteIds), [sharedSiteIds]);

  const sharingParticipants: SharingParticipant[] = useMemo(() => {
    const sharedParticipantType = new Set(sharedTypes);
    const sharingLists: SharingParticipant[] = [];

    availableParticipants?.forEach((p) => {
      const sources = [];
      if (siteIds.has(p.siteId)) sources.push('Manually Added');
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
  }, [availableParticipants, sharedTypes, siteIds]);

  const [filteredParticipants, setFilteredParticipants] = useState(sharingParticipants);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());

  const handleDeletePermissions = () => {
    onDeleteSharingPermission(Array.from(checkedParticipants));
    setCheckedParticipants(new Set());
    setOpenConfirmation(false);
  };

  const participantTypeOptions = useMemo(() => {
    return participantTypes.map((v) => ({ id: v.id, name: v.typeName }));
  }, [participantTypes]);

  const selectedParticipantList = useMemo(() => {
    return sharingParticipants.filter((p) => checkedParticipants.has(p.siteId!));
  }, [checkedParticipants, sharingParticipants]);

  const handleCheckboxChange = () => {
    if (selectAllState === TriStateCheckboxState.unchecked) {
      const selectedSiteIds = new Set<number>();
      filteredParticipants.forEach((p) => {
        if (p.addedBy.includes('Manually Added')) selectedSiteIds.add(p.siteId);
      });
      setCheckedParticipants(selectedSiteIds);
    } else {
      setCheckedParticipants(new Set());
    }
  };

  const isSelectedAll = useMemo(() => {
    if (!filteredParticipants.length || !checkedParticipants.size) return false;
    return filteredParticipants
      .filter((p) => p.addedBy.includes('Manually Added'))
      .every((p) => checkedParticipants.has(p.siteId!));
  }, [filteredParticipants, checkedParticipants]);

  const showDeletionNotice = (participant: SharingParticipant) => {
    const remainSources = participant.addedBy.filter((source) => source !== 'Manually Added');
    if (remainSources.length) {
      return (
        <span> (This site will remain shared by {formatStringsWithSeparator(remainSources)})</span>
      );
    }
  };

  useEffect(() => {
    if (isSelectedAll) {
      setSelectAllState(TriStateCheckboxState.checked);
    } else if (checkedParticipants.size > 0) {
      setSelectAllState(TriStateCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(TriStateCheckboxState.unchecked);
    }
  }, [checkedParticipants.size, isSelectedAll]);

  if (isLoading) return <Loading />;
  const deletePermissionBtn = (
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

  const tableHeader = () => (
    <>
      <SortableTableHeader<SharingParticipant> sortKey='name' header='Participant Name' />
      <th>Participant Type</th>
      <SortableTableHeader<SharingParticipant> sortKey='addedBy' header='Source' />
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
      <ParticipantsTable
        showAddedByColumn
        participants={sharingParticipants}
        filterText={filterText}
        selectedTypeIds={selectedTypeIds}
        selectedParticipantIds={checkedParticipants}
        onSelectedChange={setCheckedParticipants}
        tableHeader={tableHeader}
        onFilteredParticipantChanged={setFilteredParticipants}
        className='shared-participants-table'
        hideSelectAllCheckbox
      />
    </div>
  );
}
