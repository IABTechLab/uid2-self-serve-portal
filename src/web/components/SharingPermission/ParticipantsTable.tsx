import clsx from 'clsx';
import { ReactNode } from 'react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { ParticipantItem } from './ParticipantItem';
import { ParticipantTSType } from './ParticipantTableHelper';

import './ParticipantsTable.scss';

type ParticipantsTableProps<T extends ParticipantTSType> = {
  tableHeader: ReactNode;
  participants: T[];
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  className?: string;
};

function ParticipantsTableContent<T extends ParticipantTSType>({
  tableHeader,
  participants,
  onSelectedChange,
  selectedParticipantIds = new Set(),
  className,
}: ParticipantsTableProps<T>) {
  const { sortData } = useSortable<AvailableParticipantDTO>();
  const sortedData = sortData(participants);

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
      {tableHeader}
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
