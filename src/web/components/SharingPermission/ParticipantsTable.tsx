import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: AvailableParticipantDTO[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  tableHeader: (filteredParticipants: AvailableParticipantDTO[]) => ReactNode;
  className?: string;
  hideSelectAllCheckbox?: boolean;
  showAddedByColumn?: boolean;
  onFilteredParticipantChanged?: (filteredParticipants: AvailableParticipantDTO[]) => void;
};

function ParticipantsTableContent({
  tableHeader,
  participants,
  filterText,
  selectedTypeIds,
  onSelectedChange,
  selectedParticipantIds = new Set(),
  className,
  hideSelectAllCheckbox,
  showAddedByColumn,
  onFilteredParticipantChanged,
}: ParticipantsTableProps) {
  const [filteredParticipants, setFilteredParticipants] = useState(participants);
  const { sortData } = useSortable<AvailableParticipantDTO>();
  const [selectAllState, setSelectAllState] = useState<CheckedState>(
    TriStateCheckboxState.unchecked
  );
  const sortedData = useMemo(
    () => sortData(filteredParticipants),
    [filteredParticipants, sortData]
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
    if (onFilteredParticipantChanged) onFilteredParticipantChanged(filtered);
  }, [participants, filterText, selectedTypeIds, onFilteredParticipantChanged]);

  const isSelectedAll = useMemo(() => {
    if (!filteredParticipants.length) return false;
    return filteredParticipants.every((p) => selectedParticipantIds.has(p.siteId!));
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

  const handleCheckChange = (participant: AvailableParticipantDTO) => {
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
            {!hideSelectAllCheckbox && (
              <TriStateCheckbox
                onClick={handleCheckboxChange}
                status={selectAllState}
                className='participant-checkbox'
              />
            )}
          </th>
          {tableHeader(filteredParticipants)}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((participant) => (
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

export function ParticipantsTable(props: ParticipantsTableProps) {
  return (
    <SortableProvider>
      <ParticipantsTableContent {...props} />
    </SortableProvider>
  );
}
