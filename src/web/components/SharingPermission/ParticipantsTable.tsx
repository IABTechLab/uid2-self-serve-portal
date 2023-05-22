import { ReactNode, useEffect, useState } from 'react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantItem } from './ParticipantItem';

type ParticipantsTableProps = {
  participants: ParticipantPayload[];
  filter: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: number[]) => void;
  selectedParticipant?: number[];
  children?: ReactNode;
  className?: string;
};

export function ParticipantsTable({
  participants,
  filter,
  children,
  selectedTypeIds,
  onSelectedChange,
  selectedParticipant,
  className,
}: ParticipantsTableProps) {
  const [filteredParticipants, setFilteredParticipants] = useState(participants);

  useEffect(() => {
    let filtered = participants;

    if (selectedTypeIds && selectedTypeIds.size > 0) {
      filtered = filtered.filter((p) => p.types?.some((t) => selectedTypeIds.has(t.id)));
    }

    if (filter) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
    }

    setFilteredParticipants(filtered);
  }, [participants, filter, selectedTypeIds]);

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
    <table className={className}>
      {children}
      {filteredParticipants.map((participant) => (
        <ParticipantItem
          key={participant.id}
          participant={participant}
          onClick={() => handleCheckChange(participant)}
          checked={!!selectedParticipant?.includes(participant.id!)}
        />
      ))}
    </table>
  );
}
