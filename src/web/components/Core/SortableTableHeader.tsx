import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { SortOrder, useSortable } from '../../contexts/SortableTableProvider';

import './SortableTableHeader.scss';

type SortableTableHeaderProps<TData> = {
  className?: string;
  header: ReactNode;
  sortKey: keyof TData;
  customSortFn?: (a: TData, b: TData) => number;
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
  customSortFn,
}: SortableTableHeaderProps<TData>) {
  const { sortOrder, toggleSort, sortKey: currentSortKey, setCustomSortFn } = useSortable<TData>();

  const isActive = sortKey === currentSortKey;

  const handleHeaderClick = () => {
    if (customSortFn) {
      setCustomSortFn(customSortFn);
    } else {
      setCustomSortFn(null);
    }
    toggleSort(sortKey);
  };

  return (
    <th className={clsx('sortable-table-header', className)}>
      <button type='button' onClick={handleHeaderClick}>
        {header}
        <FontAwesomeIcon icon={renderSortingIcon(isActive ? sortOrder : undefined)} />
      </button>
    </th>
  );
}
