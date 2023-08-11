import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { SortOrder, useSortable } from '../../contexts/SortableTableProvider';

import './SortableTableHeader.scss';

type SortableTableHeaderProps<TData> = {
  className?: string;
  header: ReactNode;
  sortKey: keyof TData;
};

const renderSortingIcon = (sortOrder: SortOrder) => {
  switch (sortOrder) {
    case 'desc':
      return 'sort-down';
    case 'asc':
      return 'sort-up';
    default:
      return 'sort';
  }
};

export function SortableTableHeader<TData extends {}>({
  className,
  header,
  sortKey,
}: SortableTableHeaderProps<TData>) {
  const { sortOrder, toggleSort, sortKey: currentSortKey } = useSortable<TData>();

  const isActive = sortKey === currentSortKey;

  return (
    <th className={clsx('sortable-table-header', className)}>
      <button type='button' onClick={() => toggleSort(sortKey)}>
        {header}
        <FontAwesomeIcon icon={renderSortingIcon(isActive ? sortOrder : undefined)} />
      </button>
    </th>
  );
}
