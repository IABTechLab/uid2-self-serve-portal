import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: ParticipantPayload[];
  defaultSelected: number[];
  onSelectedChange: (selectedItems: number[]) => void;
};

export function ParticipantSearchBar({
  participants,
  defaultSelected,
  onSelectedChange,
}: ParticipantSearchBarProps) {
  const [filter, setFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [checkedParticipants, setCheckedParticipants] = useState(defaultSelected);
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setCheckedParticipants([]);
    } else {
      setCheckedParticipants(participants.map((p) => p.id!));
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
          onChange={(event) => setFilter(event.target.value)}
          placeholder='Search and Add Participants'
          value={filter}
        />
        <FontAwesomeIcon icon='search' className='search-icon' />
      </div>
      {dropdownOpen && (
        <div className='search-bar-dropdown'>
          <div className='search-bar-type-filter'>
            <div className='search-bar-type-filter-title'>Only show me:</div>
            <TypeFilter
              onFilterChange={handleFilterChange}
              types={[
                { id: 1, typeName: 'Type 1' },
                { id: 2, typeName: 'Type 2' },
                { id: 3, typeName: 'Type 3' },
              ]}
            />
          </div>
          <ParticipantsTable
            participants={participants}
            filter={filter}
            selectedTypeIds={selectedTypeIds}
            selectedParticipant={checkedParticipants}
            onSelectedChange={handleSelectedChange}
            className='search-bar-participants'
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
