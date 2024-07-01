import clsx from 'clsx';
import { ChangeEvent, useCallback, useState } from 'react';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { ClientType, ClientTypes } from '../../../api/services/adminServiceHelpers';
import { TriStateCheckbox, TriStateCheckboxState } from '../Input/TriStateCheckbox';
import { SearchBarContainer, SearchBarInput, SearchBarResults } from '../Search/SearchBar';
import { ParticipantsTable } from './ParticipantsTable';
import { filterSites, getSelectAllState, isSelectedAll } from './ParticipantTableHelper';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = Readonly<{
  sites: SharingSiteDTO[];
  selectedParticipantIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  open: boolean;
  onToggleOpen: (open: boolean) => void;
}>;

export function ParticipantSearchBar({
  sites,
  selectedParticipantIds = new Set(),
  onSelectedChange,
  open,
  onToggleOpen,
}: ParticipantSearchBarProps) {
  const [filterText, setFilterText] = useState('');
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<ClientType>());
  const filteredSites = filterSites(sites, filterText, selectedTypeIds);
  const checkboxStatus = getSelectAllState(
    isSelectedAll(filteredSites, selectedParticipantIds),
    selectedParticipantIds
  );

  const handleFilterChange = (typeIds: Set<ClientType>) => {
    setSelectedTypeIds(typeIds);
  };

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    if (event.target.value === '') {
      onToggleOpen(false);
    } else {
      onToggleOpen(true);
    }
  };

  const handleCheckboxChange = () => {
    if (checkboxStatus === TriStateCheckboxState.unchecked) {
      const selectedSiteIds = new Set<number>();
      filteredSites.forEach((p) => {
        selectedSiteIds.add(p.id);
      });
      onSelectedChange(selectedSiteIds);
    } else {
      onSelectedChange(new Set());
    }
  };

  const tableHeader = (
    <thead>
      <tr className='participant-item-with-checkbox'>
        <th>
          <TriStateCheckbox onClick={handleCheckboxChange} status={checkboxStatus} />
        </th>
        <th colSpan={3}>
          <span className='select-all'>Select All {filteredSites.length} Participants</span>
        </th>
      </tr>
    </thead>
  );

  return (
    <SearchBarContainer
      className={clsx('participants-search-bar')}
      handleOnBlur={useCallback(() => onToggleOpen(false), [onToggleOpen])}
    >
      <SearchBarInput
        className='participants-search-input'
        onClick={() => onToggleOpen(true)}
        onChange={handleFilterTextChange}
        placeholder='Search Participants'
        fullBorder={open}
        value={filterText}
      />
      {open && (
        <SearchBarResults className='participants-search-results'>
          <div className='search-bar-type-filter'>
            <div className='search-bar-type-filter-title'>Only show me:</div>
            <TypeFilter
              onFilterChange={handleFilterChange}
              types={ClientTypes}
              selectedTypeIds={selectedTypeIds}
            />
          </div>
          <ParticipantsTable
            sites={filteredSites}
            selectedParticipantIds={selectedParticipantIds}
            onSelectedChange={onSelectedChange}
            className='search-bar-participants'
            tableHeader={tableHeader}
          />
          {/* TODO: update the participant not appearing url */}
          {/* <div className='search-bar-footer'>
            <a className='outside-link' href='/'>Participant Not Appearing in Search?</a>
          </div> */}
        </SearchBarResults>
      )}
    </SearchBarContainer>
  );
}
