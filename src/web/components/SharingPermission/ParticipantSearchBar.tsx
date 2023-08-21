import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { SearchBarContainer, SearchBarInput, SearchBarResults } from '../Search/SearchBar';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: AvailableParticipantDTO[];
  participantTypes: ParticipantTypeDTO[];
  selectedParticipantIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  open: boolean;
  onToggleOpen: (open: boolean) => void;
};

export function ParticipantSearchBar({
  participants,
  selectedParticipantIds,
  onSelectedChange,
  participantTypes,
  open,
  onToggleOpen,
}: ParticipantSearchBarProps) {
  const [filterText, setFilterText] = useState('');
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());

  const handleFilterChange = (typeIds: Set<number>) => {
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
  const tableHeader = (filteredParticipants: AvailableParticipantDTO[]) => (
    <th colSpan={3}>
      <span className='select-all'>Select All {filteredParticipants.length} Participants</span>
    </th>
  );

  return (
    <SearchBarContainer
      className={clsx('participants-search-bar')}
      handleOnBlur={() => onToggleOpen(false)}
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
            <TypeFilter onFilterChange={handleFilterChange} types={participantTypes} />
          </div>
          <ParticipantsTable
            participants={participants}
            filterText={filterText}
            selectedTypeIds={selectedTypeIds}
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
