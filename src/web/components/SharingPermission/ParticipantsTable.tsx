import {
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { columns, globalFilterFn, setToObject } from './ParticipantsTableHelper';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: AvailableParticipantDTO[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  tableHeader: (table: Table<AvailableParticipantDTO>) => ReactNode;
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
  const defaultSelected: RowSelectionState = setToObject(selectedParticipantIds);
  const [rowSelection, setRowSelection] = useState(defaultSelected);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: participants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow) => String(originalRow.siteId!),
    enableSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      globalFilter: filterText,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        addedBy: !!showAddedByColumn,
      },
    },
  });

  useEffect(() => {
    const selectedSiteIds = table.getSelectedRowModel().flatRows.map((row) => row.original.siteId!);
    onSelectedChange(new Set(selectedSiteIds));
  }, [onSelectedChange, table, rowSelection]);

  useEffect(() => {
    setColumnFilters([
      {
        id: 'types',
        value: selectedTypeIds,
      },
    ]);
  }, [selectedTypeIds]);

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      <thead>{tableHeader(table)}</thead>
      <tbody>
        {table.getRowModel().rows.map((participantRow) => (
          <tr key={participantRow.id} className='participant-item'>
            {participantRow.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
