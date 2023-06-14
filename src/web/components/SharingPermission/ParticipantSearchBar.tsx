import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useState } from 'react';

import { ParticipantPayload, ParticipantResponse } from '../../services/participant';
import { ParticipantTypeResponse } from '../../services/participantType';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: ParticipantResponse[];
  defaultSelected: number[];
  onSelectedChange: (selectedItems: number[]) => void;
  participantTypes: ParticipantTypeResponse[];
};

export function ParticipantSearchBar({
  participants,
  defaultSelected,
  onSelectedChange,
  participantTypes,
}: ParticipantSearchBarProps) {
  const [filterText, setFilterText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [checkedParticipants, setCheckedParticipants] = useState(defaultSelected);
  const [filteredParticipants, setFilteredParticipants] =
    useState<ParticipantPayload[]>(participants);

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setCheckedParticipants([]);
    } else {
      setCheckedParticipants(participants.map((p) => p.siteId!));
    }
  };

  const handleFilterChange = (typeIds: Set<number>) => {
    setSelectedTypeIds(typeIds);
  };

  const handleSelectedChange = (selectedItems: number[]) => {
    if (selectedItems.length > 0 && selectedItems.length === participants.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setCheckedParticipants(selectedItems);
  };

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    if (!dropdownOpen) {
      setDropdownOpen(true);
    }
  };

  useEffect(() => {
    onSelectedChange(checkedParticipants);
  }, [checkedParticipants, onSelectedChange]);

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
            selectedParticipant={checkedParticipants}
            onSelectedChange={handleSelectedChange}
            className='search-bar-participants'
            filteredParticipants={filteredParticipants}
            onFilteredParticipantChange={setFilteredParticipants}
          >
            <tr>
              <th>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  id='select-all-checkbox'
                  className='participant-checkbox'
                />
              </th>
              <th colSpan={3}>
                <span className='select-all'>Select All {participants.length} Participants</span>
              </th>
            </tr>
          </ParticipantsTable>
          {/* TODO: update the participant not appearing url */}
          <div className='search-bar-footer'>
            <a href='/'>Participant Not Appearing in Search?</a>
          </div>
        </div>
      )}
    </div>
  );
}
