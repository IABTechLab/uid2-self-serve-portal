import { CheckedState } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';
import { SharingParticipant } from './bulkAddPermissionsHelpers';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantTSType = AvailableParticipantDTO | SharingParticipant;

type ParticipantsTableProps<T extends ParticipantTSType> = {
  participants: T[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  tableHeader: (filteredParticipants: T[]) => ReactNode;
  className?: string;
  hideSelectAllCheckbox?: boolean;
  onFilteredParticipantChanged?: (filteredParticipants: T[]) => void;
};

function ParticipantsTableContent<T extends ParticipantTSType>({
  tableHeader,
  participants,
  filterText,
  selectedTypeIds,
  onSelectedChange,
  selectedParticipantIds = new Set(),
  className,
  hideSelectAllCheckbox,
  onFilteredParticipantChanged,
}: ParticipantsTableProps<T>) {
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
        <tr className='participant-item-with-checkbox'>
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
            key={participant.siteId}
            participant={participant}
            onClick={() => handleCheckChange(participant)}
            checked={!!selectedParticipantIds.has(participant.siteId!)}
          />
        ))}
      </tbody>
    </table>
  );
}

export function ParticipantsTable<T extends ParticipantTSType>(props: ParticipantsTableProps<T>) {
  return (
    <SortableProvider>
      <ParticipantsTableContent<T> {...props} />
    </SortableProvider>
  );
}
