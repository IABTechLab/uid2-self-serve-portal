import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: ParticipantPayload[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: number[]) => void;
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
  showAddedByColumn,
}: ParticipantsTableProps) {
  const [filteredParticipants, setFilteredParticipants] = useState(participants);

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

  const handleCheckChange = (participant: ParticipantPayload) => {
    const newCheckedItems = new Set(selectedParticipant);
    if (newCheckedItems.has(participant.id!)) {
      newCheckedItems.delete(participant.id!);
    } else {
      newCheckedItems.add(participant.id!);
    }
    onSelectedChange(Array.from(newCheckedItems));
  };

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      <thead>{children}</thead>
      <tbody>
        {filteredParticipants.map((participant) => (
          <ParticipantItem
            addedBy={showAddedByColumn ? 'Auto' : undefined} // TODO: Update this once we have auto add functionality
            key={participant.id}
            participant={participant}
            onClick={() => handleCheckChange(participant)}
            checked={!!selectedParticipant?.includes(participant.id!)}
          />
        ))}
      </tbody>
    </table>
  );
}
