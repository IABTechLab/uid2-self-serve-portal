import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckedState } from '@radix-ui/react-checkbox';
import {
  ColumnFilter,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  RowSelectionState,
  SortingState,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';

import './ParticipantsTable.scss';

type ParticipantsTableProps = {
  participants: AvailableParticipantDTO[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  // tableHeader: (table: Table<AvailableParticipantDTO>) => ReactNode;
  className?: string;
  showAddedByColumn?: boolean;
};

const getCheckboxStatus = (table: Table<AvailableParticipantDTO>) => {
  if (table.getIsAllRowsSelected()) {
    return TriStateCheckboxState.checked;
  }
  if (table.getIsSomeRowsSelected()) {
    return TriStateCheckboxState.indeterminate as CheckedState;
  }
  return TriStateCheckboxState.unchecked;
};

export function setToObject<T>(inputSet: Set<T>) {
  const resultObject: { [key: string]: true } = {};

  for (const item of inputSet) {
    resultObject[String(item)] = true;
  }

  return resultObject;
}

const getParticipantTypes = (participantTypes?: ParticipantTypeDTO[]) => {
  if (!participantTypes) return null;
  return participantTypes.map((pt) => (
    <div className='participant-type-label' key={pt.typeName}>
      {pt.typeName}
    </div>
  ));
};

const columnHelper = createColumnHelper<AvailableParticipantDTO>();
const filteredByType: FilterFn<AvailableParticipantDTO> = (
  row,
  _id,
  filterValue: Set<number> | undefined
) => {
  if (!filterValue || !filterValue.size) return true;
  return ((row.getValue('types') ?? []) as ParticipantTypeDTO[]).some((t) => filterValue.has(t.id));
};

export const globalFilterFn: FilterFn<AvailableParticipantDTO> = (
  row,
  columnId,
  filterValue: string
) => {
  const search = filterValue.toLowerCase();

  let value = row.getValue(columnId) as string;
  if (typeof value === 'number') value = String(value);

  return value?.toLowerCase().includes(search);
};

const renderCheckboxHeader = (header?: Header<AvailableParticipantDTO, unknown>) => {
  return header ? flexRender(header.column.columnDef.header, header.getContext()) : null;
};

const renderSortableHeader = (header: Header<AvailableParticipantDTO, unknown>) => (
  <button
    type='button'
    className='sortable-table-header'
    onClick={header.column.getToggleSortingHandler()}
  >
    {flexRender(header.column.columnDef.header, header.getContext())}
    <FontAwesomeIcon icon='sort' className='' />
  </button>
);

const renderTableHeader = (table: Table<AvailableParticipantDTO>, showCheckbox: boolean) =>
  table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => {
        return (
          <th key={header.id}>
            {header.id === 'checkbox'
              ? showCheckbox && renderCheckboxHeader(header)
              : renderSortableHeader(header)}
          </th>
        );
      })}
    </tr>
  ));

const logo = '/default-logo.svg';

export const columns = [
  columnHelper.accessor((row) => row, {
    id: 'checkbox',
    header: ({ table }) => (
      <TriStateCheckbox
        status={getCheckboxStatus(table)}
        onClick={() => {
          table.toggleAllRowsSelected(getCheckboxStatus(table) === TriStateCheckboxState.unchecked);
        }}
      />
    ),
    cell: ({ row }) => (
      <div className='px-1'>
        <TriStateCheckbox
          onClick={row.getToggleSelectedHandler()}
          status={row.getIsSelected()}
          className='participant-checkbox'
        />
      </div>
    ),
  }),
  columnHelper.accessor('name', {
    header: () => 'Participant Name',
    cell: (info) => (
      <div className='participant-name-cell'>
        <img src={logo} alt={info.getValue()} className='participant-logo' />
        <label className='checkbox-label'>{info.getValue()}</label>
      </div>
    ),
  }),
  columnHelper.accessor('types', {
    id: 'types',
    header: () => 'Participant Type',
    filterFn: filteredByType,
    cell: (info) => <div className='participant-types'>{getParticipantTypes(info.getValue())}</div>,
  }),
  columnHelper.accessor((row) => row, {
    id: 'addedBy',
    header: 'Added By',
    cell: () => <>Manual</>,
  }),
];

export function ParticipantsTableReactTableDemo({
  // tableHeader,
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
      <thead>{renderTableHeader(table, true)}</thead>
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
