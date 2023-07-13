import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { ParticipantTypeResponse } from '../../services/participantType';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: ParticipantResponse[];
  participantTypes: ParticipantTypeResponse[];
  selectedParticipantIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
};

export function ParticipantSearchBar({
  participants,
  selectedParticipantIds,
  onSelectedChange,
  participantTypes,
}: ParticipantSearchBarProps) {
  const [filterText, setFilterText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());

  const handleFilterChange = (typeIds: Set<number>) => {
    setSelectedTypeIds(typeIds);
  };

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    if (!dropdownOpen) {
      setDropdownOpen(true);
    }
  };
  const tableHeader = (filteredParticipants: ParticipantResponse[]) => (
    <th colSpan={3}>
      <span className='select-all'>Select All {filteredParticipants.length} Participants</span>
    </th>
  );

  return (
    <div className={clsx('search-bar', { clicked: dropdownOpen })}>
      <div className='search-bar-input-container'>
        <input
          type='text'
          className='search-bar-input'
          onClick={() => setDropdownOpen(true)}
          onChange={handleFilterTextChange}
          placeholder='Search and Add Participants'
          value={filterText}
        />
        <FontAwesomeIcon icon='search' className='search-icon' />
      </div>
      {dropdownOpen && (
        <div className='search-bar-dropdown'>
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
        </div>
      )}
    </div>
  );
}
