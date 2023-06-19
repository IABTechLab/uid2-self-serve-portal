import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { ParticipantTypeResponse } from '../../services/participantType';
import { SelectAllCheckbox, SelectAllCheckboxState } from '../Core/SelectAllCheckbox';
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
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    SelectAllCheckboxState.unchecked
  );
  const [selectedTypeIds, setSelectedTypeIds] = useState(new Set<number>());
  const [checkedParticipants, setCheckedParticipants] = useState(defaultSelected);
  const [filteredParticipants, setFilteredParticipants] =
    useState<ParticipantResponse[]>(participants);

  const handleSelectAll = () => {
    setCheckedParticipants(filteredParticipants.map((p) => p.id!));
  };

  const handleUnselectAll = () => {
    setCheckedParticipants([]);
  };

  const isSelectedAll = useMemo(() => {
    const selected = new Set(checkedParticipants);
    return filteredParticipants.every((p) => selected.has(p.siteId!));
  }, [filteredParticipants, checkedParticipants]);

  const handleFilterChange = (typeIds: Set<number>) => {
    setSelectedTypeIds(typeIds);
  };

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    if (!dropdownOpen) {
      setDropdownOpen(true);
    }
  };

  useEffect(() => {
    if (isSelectedAll) {
      setSelectAllState(SelectAllCheckboxState.checked);
    } else if (checkedParticipants.length > 0) {
      setSelectAllState(SelectAllCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(SelectAllCheckboxState.unchecked);
    }
  }, [checkedParticipants.length, isSelectedAll]);

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
            onSelectedChange={setCheckedParticipants}
            className='search-bar-participants'
            filteredParticipants={filteredParticipants}
            onFilteredParticipantChange={setFilteredParticipants}
          >
            <tr>
              <th>
                <SelectAllCheckbox
                  onSelectAll={handleSelectAll}
                  onUnselect={handleUnselectAll}
                  status={selectAllState}
                />
              </th>
              <th colSpan={3}>
                <span className='select-all'>
                  Select All {filteredParticipants.length} Participants
                </span>
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
