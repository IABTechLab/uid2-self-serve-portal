import clsx from 'clsx';
import { ReactNode } from 'react';

import { SharingSiteDTO, SharingSiteWithSource } from '../../../api/helpers/siteConvertingHelpers';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { ParticipantItem } from './ParticipantItem';

import './ParticipantsTable.scss';

type ParticipantsTableProps = Readonly<{
  tableHeader: ReactNode;
  sites: SharingSiteDTO[];
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  className?: string;
  onDelete?: (siteIdsToDelete: number[]) => void;
  sharingSites?: SharingSiteWithSource[];
}>;

function ParticipantsTableContent({
  tableHeader,
  sites,
  onSelectedChange,
  selectedParticipantIds = new Set(),
  className,
  onDelete,
  sharingSites,
}: ParticipantsTableProps) {
  const { sortData } = useSortable<SharingSiteDTO>();
  const sortedSites = sortData(sites);

  const handleCheckChange = (site: SharingSiteDTO) => {
    const newCheckedItems = new Set(selectedParticipantIds);
    if (newCheckedItems.has(site.id)) {
      newCheckedItems.delete(site.id);
    } else {
      newCheckedItems.add(site.id);
    }

    onSelectedChange(newCheckedItems);
  };

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      {tableHeader}
      <tbody>
        {sortedSites.map((participant) => (
          <ParticipantItem
            key={participant.id}
            site={participant}
            onClick={() => handleCheckChange(participant)}
            checked={!!selectedParticipantIds.has(participant.id)}
            onDelete={onDelete}
            sharingSites={sharingSites}
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
