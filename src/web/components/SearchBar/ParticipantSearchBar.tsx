import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantItem } from './ParticipantItem';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: ParticipantPayload[];
  defaultSelected: number[];
  onSelect: (selectedItems: ParticipantPayload[]) => void;
};

export function ParticipantSearchBar({
  participants,
  defaultSelected,
  onSelect,
}: ParticipantSearchBarProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set(defaultSelected));
  const [filter, setFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [filteredParticipants, setFilteredParticipants] = useState(participants);

  useEffect(() => {
    setCheckedItems(new Set(defaultSelected));
  }, [defaultSelected]);

  const handleCheckChange = (participant: ParticipantPayload) => {
    setCheckedItems((prevState) => {
      const newCheckedItems = new Set(prevState);
      if (newCheckedItems.has(participant.id!)) {
        newCheckedItems.delete(participant.id!);
      } else {
        newCheckedItems.add(participant.id!);
      }
      return newCheckedItems;
    });
  };

  const handleButtonClick = () => {
    onSelect(Array.from(checkedItems));
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(participants.map((p) => p.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleFilterChange = (typeIds: Set<number>) => {
    setSelectedTypeIds(selectedTypeIds);
  };

  useEffect(() => {
    let filtered = participants;

    if (selectedTypeIds.size > 0) {
      filtered = filtered.filter((p) => p.types?.some((t) => selectedTypeIds.has(t.id)));
    }

    if (filter) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
    }

    setFilteredParticipants(filtered);
  }, [participants, filter, selectedTypeIds]);

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
            <span>Only show me:</span>
            <TypeFilter
              onFilterChange={handleFilterChange}
              types={[
                { id: 1, typeName: 'Type 1' },
                { id: 2, typeName: 'Type 2' },
                { id: 3, typeName: 'Type 3' },
              ]}
            />
          </div>
          <div className='search-bar-participants'>
            <div className='participant-item'>
              <input
                type='checkbox'
                checked={selectAll}
                onChange={handleSelectAllChange}
                id='select-all-checkbox'
                className='participant-checkbox'
              />
              <span className='select-all'>Select All {participants.length} Participants</span>
            </div>
            {filteredParticipants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                onClick={() => handleCheckChange(participant)}
                checked={checkedItems.has(participant.id!)}
              />
            ))}
          </div>
          {/* TODO: update the participant not appearing url */}
          <div className='search-bar-footer'>
            <a href='/'>Participant Not Appearing in Search?</a>
          </div>
        </div>
      )}
    </div>
  );
}
