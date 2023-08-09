import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from '@tanstack/react-table';
import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { ParticipantsTable } from './ParticipantsTable';
import { TypeFilter } from './TypeFilter';

import './ParticipantSearchBar.scss';

type ParticipantSearchBarProps = {
  participants: AvailableParticipantDTO[];
  participantTypes: ParticipantTypeDTO[];
  onSelectedChange: (selectedItems: Set<number>) => void;
  open: boolean;
  onToggleOpen: (open: boolean) => void;
};

export function ParticipantSearchBar({
  participants,
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
  const tableHeader = (table: Table<AvailableParticipantDTO>) => {
    const filteredParticipants = table.getFilteredRowModel().rows;
    return (
      <th colSpan={3}>
        <span className='select-all'>Select All {filteredParticipants.length} Participants</span>
      </th>
    );
  };

  return (
    <div className={clsx('search-bar', { clicked: open })}>
      <div className='search-bar-input-container'>
        <input
          type='text'
          className='search-bar-input'
          onClick={() => onToggleOpen(true)}
          onChange={handleFilterTextChange}
          placeholder='Search Participants'
          value={filterText}
        />
        <FontAwesomeIcon icon='search' className='search-icon' />
      </div>
      {open && (
        <div className='search-bar-dropdown'>
          <div className='search-bar-type-filter'>
            <div className='search-bar-type-filter-title'>Only show me:</div>
            <TypeFilter onFilterChange={handleFilterChange} types={participantTypes} />
          </div>
          <ParticipantsTable
            participants={participants}
            filterText={filterText}
            selectedTypeIds={selectedTypeIds}
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
