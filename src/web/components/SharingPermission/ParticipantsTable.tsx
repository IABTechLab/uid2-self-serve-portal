import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: ParticipantResponse[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: number[]) => void;
  filteredParticipants: ParticipantResponse[];
  onFilteredParticipantChange: (filteredParticipant: ParticipantResponse[]) => void;
  selectedParticipant?: number[];
  children?: ReactNode;
  className?: string;
  showAddedByColumn?: boolean;
};

export function ParticipantsTable({
  participants,
  filterText,
  children,
  selectedTypeIds,
  onSelectedChange,
  selectedParticipant,
  className,
  filteredParticipants,
  onFilteredParticipantChange,
  showAddedByColumn,
}: ParticipantsTableProps) {
  useEffect(() => {
    let filtered = participants;

    if (selectedTypeIds && selectedTypeIds.size > 0) {
      filtered = filtered.filter((p) => p.types?.some((t) => selectedTypeIds.has(t.id)));
    }

    if (filterText) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(filterText.toLowerCase()));
    }

    onFilteredParticipantChange(filtered);
  }, [participants, filterText, selectedTypeIds, onFilteredParticipantChange]);

  const handleCheckChange = (participant: ParticipantResponse) => {
    const newCheckedItems = new Set(selectedParticipant);
    if (newCheckedItems.has(participant.siteId!)) {
      newCheckedItems.delete(participant.siteId!);
    } else {
      newCheckedItems.add(participant.siteId!);
    }
    onSelectedChange(Array.from(newCheckedItems));
  };

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      <thead>{children}</thead>
      <tbody>
        {filteredParticipants.map((participant) => (
          <ParticipantItem
            addedBy={showAddedByColumn ? 'Manual' : undefined} // TODO: Update this once we have auto add functionality
            key={participant.id}
            participant={participant}
            onClick={() => handleCheckChange(participant)}
            checked={!!selectedParticipant?.includes(participant.siteId!)}
          />
        ))}
      </tbody>
    </table>
  );
}
