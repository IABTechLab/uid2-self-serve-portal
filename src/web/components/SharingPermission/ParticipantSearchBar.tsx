import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: ParticipantResponse[];
  defaultSelected: number[];
  onSelectedChange: (selectedItems: number[]) => void;
};

export function ParticipantSearchBar({
  participants,
  defaultSelected,
  onSelectedChange,
}: ParticipantSearchBarProps) {
  const [filterText, setFilterText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [checkedParticipants, setCheckedParticipants] = useState(defaultSelected);

  useEffect(() => {
    if (checkedParticipants.length > 0 && checkedParticipants.length === participants.length) {
      setSelectAllState(TriStateCheckboxState.checked);
    } else if (checkedParticipants.length > 0) {
      setSelectAllState(TriStateCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(TriStateCheckboxState.unchecked);
    }
  }, [checkedParticipants.length, participants.length]);

  const handleCheckboxChange = () => {
    if (selectAllState === TriStateCheckboxState.unchecked) {
      setCheckedParticipants(participants.map((p) => p.id!));
    } else {
      setCheckedParticipants([]);
    }
  };

  const handleFilterChange = (typeIds: Set<number>) => {
    setSelectedTypeIds(typeIds);
  };

  useEffect(() => {}, [checkedParticipants, onSelectedChange]);

  return (
    <div className={clsx('search-bar', { clicked: dropdownOpen })}>
      <div className='search-bar-input-container'>
        <input
          type='text'
          className='search-bar-input'
          onClick={() => setDropdownOpen(true)}
          onChange={(event) => setFilterText(event.target.value)}
          placeholder='Search and Add Participants'
          value={filterText}
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
            filterText={filterText}
            selectedTypeIds={selectedTypeIds}
            selectedParticipant={checkedParticipants}
            onSelectedChange={setCheckedParticipants}
            className='search-bar-participants'
          >
            <tr>
              <th>
                <TriStateCheckbox onClick={handleCheckboxChange} status={selectAllState} />
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
