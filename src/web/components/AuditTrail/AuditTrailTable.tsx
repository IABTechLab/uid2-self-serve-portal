import { useState } from 'react';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { getFormattedEvent, getPrettyAuditDetails } from '../../services/auditTrailService';
import { PagingTool } from '../Core/Paging/PagingTool';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import SearchBarHeader from '../Search/SearchBarHeader';
import AuditTrailRow from './AuditTrailRow';

import './AuditTrail.scss';

type AuditTrailTableProps = Readonly<{
  auditTrail: AuditTrailDTO[];
}>;

function AuditTrailTableComponent({ auditTrail }: AuditTrailTableProps) {
  const initialRowsPerPage = 10;

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPageValues>(initialRowsPerPage);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState('');

  const getPagedAuditRows = (values: AuditTrailDTO[]) => {
    const pagedRows = values.filter((_, index) => {
      return (
        index >= (pageNumber - 1) * rowsPerPage &&
        index < (pageNumber - 1) * rowsPerPage + rowsPerPage
      );
    });
    return pagedRows;
  };

  const onChangeDisplayedAuditRows = (
    currentPageNumber: number,
    currentRowsPerPage: RowsPerPageValues
  ) => {
    setPageNumber(currentPageNumber);
    setRowsPerPage(currentRowsPerPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPageNumber(1);
    setRowsPerPage(initialRowsPerPage);
  };

  // first search
  let searchedAuditRows = auditTrail;
  if (searchText.length > 2) {
    searchedAuditRows = auditTrail.filter((item) => {
      const search = searchText.toLowerCase();
      return (
        item.userEmail.toLowerCase().indexOf(search) >= 0 ||
        getFormattedEvent(item.event).toLowerCase().indexOf(search) >= 0 ||
        getPrettyAuditDetails(item.eventData).toLowerCase().indexOf(search) >= 0
      );
    });
  }
  // then sort
  const { sortData } = useSortable<AuditTrailDTO>();
  const sortedAuditLogs = sortData(searchedAuditRows);
  // finally page
  const pagedRows = getPagedAuditRows(sortedAuditLogs);

  return (
    <div className='audit-trail-table-container'>
      <div className='table-header'>
        <div className='table-header-right'>
          <SearchBarHeader
            value={searchText}
            onChange={handleSearch}
            placeholder='Search audit trail'
          />
        </div>
      </div>
      <table className='audit-log-table'>
        <thead>
          <tr>
            <SortableTableHeader<AuditTrailDTO> sortKey='updated_at' header='Date' />
            <SortableTableHeader<AuditTrailDTO> sortKey='userEmail' header='User' />
            <SortableTableHeader<AuditTrailDTO> sortKey='event' header='Event' />
            <th>Event Data</th>
            <th>Succeeded</th>
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((log) => (
            <AuditTrailRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
      {auditTrail.length > 0 && searchText && searchedAuditRows.length === 0 && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No Audit Logs'
        >
          <span>There are no audit logs that match this search.</span>
        </TableNoDataPlaceholder>
      )}
      {!auditTrail.length && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No Audit Logs'
        >
          <span>There are no audit logs.</span>
        </TableNoDataPlaceholder>
      )}
      {!!searchedAuditRows.length && (
        <PagingTool
          numberTotalRows={searchedAuditRows.length}
          initialPageNumber={pageNumber}
          initialRowsPerPage={rowsPerPage}
          onChangeRows={onChangeDisplayedAuditRows}
        />
      )}
    </div>
  );
}

export default function AuditTrailTable(props: AuditTrailTableProps) {
  return (
    <SortableProvider>
      <AuditTrailTableComponent {...props} />
    </SortableProvider>
  );
}
