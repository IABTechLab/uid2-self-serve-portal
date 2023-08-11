import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  ICellRendererParams,
  IRowNode,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';

import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ParticipantsTable.scss';
import './ParticipantItem.scss';

type ParticipantsTableProps = {
  participants: AvailableParticipantDTO[];
  filterText: string;
  selectedTypeIds?: Set<number>;
  onSelectedChange: (selectedItems: Set<number>) => void;
  selectedParticipantIds?: Set<number>;
  tableHeader?: (filteredParticipants: AvailableParticipantDTO[]) => ReactNode;
  className?: string;
  hideCheckboxIfNoItem?: boolean;
  showAddedByColumn?: boolean;
};

const getParticipantTypes = (participantTypes?: ParticipantTypeDTO[]) => {
  if (!participantTypes) return null;
  return participantTypes.map((pt) => (
    <div className='participant-type-label' key={pt.typeName}>
      {pt.typeName}
    </div>
  ));
};

const logo = '/default-logo.svg';

const colDefs: ColDef<AvailableParticipantDTO>[] = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  {
    headerName: 'Participant Name',
    field: 'name',
    cellRenderer: (params: ICellRendererParams<AvailableParticipantDTO, string>) => {
      return (
        <div className='participant-name-cell'>
          <img src={logo} alt={params.value!} className='participant-logo' />
          <label className='checkbox-label'>{params.value!}</label>
        </div>
      );
    },
  },
  {
    headerName: 'Participant Type',
    filter: 'agSetColumnFilter',
    field: 'types',
    floatingFilterComponentParams: { suppressFilterButton: true },
    columnsMenuParams: { suppressColumnFilter: true },
    cellRenderer: (params: ICellRendererParams<AvailableParticipantDTO, ParticipantTypeDTO[]>) => {
      return <div className='participant-types'>{getParticipantTypes(params.value ?? [])}</div>;
    },
  },
  {
    headerName: 'Added By',
    valueGetter: () => 'Manual',
  },
];

export function ParticipantsTableDemo({
  participants,
  filterText,
  selectedTypeIds,
  onSelectedChange,
  tableHeader,
  selectedParticipantIds,
  className,
  hideCheckboxIfNoItem,
  showAddedByColumn,
}: ParticipantsTableProps) {
  const gridRef = useRef<AgGridReact<AvailableParticipantDTO>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '500px' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent<AvailableParticipantDTO>) => {
      const siteIds = event.api.getSelectedRows().map((participant) => participant.siteId!);
      onSelectedChange(new Set(siteIds));
    },
    [onSelectedChange]
  );

  const isRowSelectable = useMemo(() => {
    return (params: IRowNode<AvailableParticipantDTO>) => {
      // If row is not null, always show selectable, edit this once we have addedBy
      return !!params.data;
    };
  }, []);

  useEffect(() => {
    const gridApi = gridRef.current?.api as GridApi<AvailableParticipantDTO>;
    if (gridApi) {
      gridApi.setQuickFilter(filterText);
    }
  }, [filterText]);

  useEffect(() => {
    const gridApi = gridRef.current?.api as GridApi<AvailableParticipantDTO>;
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [selectedTypeIds]);

  const isExternalFilterPresent = useCallback(() => {
    return !!selectedTypeIds?.size;
  }, [selectedTypeIds]);

  const doesExternalFilterPass = useCallback(
    (node: IRowNode<AvailableParticipantDTO>) => {
      return ((node.data?.types ?? []) as ParticipantTypeDTO[]).some((t) =>
        selectedTypeIds!.has(t.id)
      );
    },
    [selectedTypeIds]
  );

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: true,
    };
  }, []);

  const onGridReady = useCallback(() => {
    const gridApi = gridRef.current?.api as GridApi<AvailableParticipantDTO>;
    gridApi.setQuickFilter(filterText);
  }, [filterText]);

  const onFirstDataRendered = useCallback(
    (event: FirstDataRenderedEvent<AvailableParticipantDTO>) => {
      event.api.forEachNode((node) => {
        node.setSelected(!!selectedParticipantIds?.has(node.data?.siteId!));
      });
    },
    [selectedParticipantIds]
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className='ag-theme-alpine'>
        <AgGridReact<AvailableParticipantDTO>
          ref={gridRef}
          rowData={participants}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection='multiple'
          suppressRowClickSelection
          isRowSelectable={isRowSelectable}
          onGridReady={onGridReady}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  );
}
