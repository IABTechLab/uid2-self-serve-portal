import { CheckedState } from '@radix-ui/react-checkbox';
import { createColumnHelper, FilterFn, Table } from '@tanstack/react-table';
import { z } from 'zod';

import { ParticipantTypeDTO, ParticipantTypeSchema } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/participantsRouter';
import { TriStateCheckbox, TriStateCheckboxState } from '../Core/TriStateCheckbox';

const getParticipantTypes = (participantTypes?: z.infer<typeof ParticipantTypeSchema>[]) => {
  if (!participantTypes) return null;
  return participantTypes.map((pt) => (
    <div className='participant-type-label' key={pt.typeName}>
      {pt.typeName}
    </div>
  ));
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
