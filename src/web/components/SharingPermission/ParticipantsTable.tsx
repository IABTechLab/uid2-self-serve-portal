import {
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { columns, globalFilterFn } from './ParticipantsTableHelper';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: AvailableParticipantDTO[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  tableHeader: (table: Table<AvailableParticipantDTO>) => ReactNode;
  className?: string;
  hideCheckboxIfNoItem?: boolean;
  showAddedByColumn?: boolean;
};

export function ParticipantsTable({
  tableHeader,
  participants,
  filterText,
  selectedTypeIds,
  onSelectedChange,
  className,
  hideCheckboxIfNoItem,
  showAddedByColumn,
}: ParticipantsTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const showCheckbox = !hideCheckboxIfNoItem || (hideCheckboxIfNoItem && !!participants.length);

  const table = useReactTable({
    data: participants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter: filterText,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        addedBy: !!showAddedByColumn,
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
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

  const renderCheckboxHeader = (header?: Header<AvailableParticipantDTO, unknown>) => {
    return header ? flexRender(header.column.columnDef.header, header.getContext()) : null;
  };

  return (
    <table className={clsx('participant-table', className)} data-testid='participant-table'>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            <th key={headerGroup.headers.at(0)?.id}>
              {showCheckbox && renderCheckboxHeader(headerGroup.headers.at(0))}
            </th>
            {tableHeader(table)}
          </tr>
        ))}
      </thead>
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
