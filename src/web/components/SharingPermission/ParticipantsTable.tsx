import {
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  RowSelectionState,
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
  hideCheckboxIfNoItem?: boolean;
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
  hideCheckboxIfNoItem,
  showAddedByColumn,
}: ParticipantsTableProps) {
  const defaultSelected: RowSelectionState = setToObject(selectedParticipantIds);
  const [rowSelection, setRowSelection] = useState(defaultSelected);
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
    getRowId: (originalRow) => String(originalRow.siteId!),
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
  });

  useEffect(() => {
    const selectedSiteIds = table.getSelectedRowModel().flatRows.map((row) => row.original.siteId!);
    onSelectedChange(new Set(selectedSiteIds));
    console.log(rowSelection);
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
