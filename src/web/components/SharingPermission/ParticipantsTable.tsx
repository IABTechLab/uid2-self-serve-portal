import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: ParticipantResponse[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  tableHeader: (filteredParticipants: ParticipantResponse[]) => ReactNode;
  className?: string;
  showAddedByColumn?: boolean;
};

export function ParticipantsTable({
  tableHeader,
  participants,
  filterText,
  selectedTypeIds,
  onSelectedChange,
  selectedParticipantIds = new Set(),
  className,
  showAddedByColumn,
}: ParticipantsTableProps) {
  const [filteredParticipants, setFilteredParticipants] = useState(participants);
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );

  const handleCheckboxChange = () => {
    if (selectAllState === TriStateCheckboxState.unchecked) {
      onSelectedChange(new Set(filteredParticipants.map((p) => p.siteId!)));
    } else {
      onSelectedChange(new Set());
    }
  };

  useEffect(() => {
    let filtered = participants;

    if (selectedTypeIds && selectedTypeIds.size > 0) {
      filtered = filtered.filter((p) => p.types?.some((t) => selectedTypeIds.has(t.id)));
    }

    if (filterText) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(filterText.toLowerCase()));
    }

    setFilteredParticipants(filtered);
  }, [participants, filterText, selectedTypeIds]);

  const isSelectedAll = useMemo(() => {
    if (!filteredParticipants.length) return false;
    return filteredParticipants.every((p) => selectedParticipantIds.has(p.id));
  }, [filteredParticipants, selectedParticipantIds]);

  useEffect(() => {
    if (isSelectedAll) {
      setSelectAllState(TriStateCheckboxState.checked);
    } else if (selectedParticipantIds.size > 0) {
      setSelectAllState(TriStateCheckboxState.indeterminate as CheckedState);
    } else {
      setSelectAllState(TriStateCheckboxState.unchecked);
    }
  }, [selectedParticipantIds.size, isSelectedAll]);

  const handleCheckChange = (participant: ParticipantResponse) => {
    const newCheckedItems = new Set(selectedParticipantIds);
    if (newCheckedItems.has(participant.siteId!)) {
      newCheckedItems.delete(participant.siteId!);
    } else {
      newCheckedItems.add(participant.siteId!);
    }

    onSelectedChange(newCheckedItems);
  };

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      <thead>
        <tr>
          <th>
            <TriStateCheckbox
              onClick={handleCheckboxChange}
              status={selectAllState}
              className='participant-checkbox'
            />
          </th>
          {tableHeader(filteredParticipants)}
        </tr>
      </thead>
      <tbody>
        {filteredParticipants.map((participant) => (
          <ParticipantItem
            addedBy={showAddedByColumn ? 'Manual' : undefined} // TODO: Update this once we have auto add functionality
            key={participant.id}
            participant={participant}
            onClick={() => handleCheckChange(participant)}
            checked={!!selectedParticipantIds.has(participant.siteId!)}
          />
        ))}
      </tbody>
    </table>
  );
}
