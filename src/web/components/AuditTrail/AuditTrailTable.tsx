import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { PagingTool } from '../Core/Paging/PagingTool';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import AuditLog from './AuditLog';

import './AuditTrail.scss';

type AuditLogTableProps = Readonly<{
  auditTrail: AuditTrailDTO[];
}>;

function AuditLogTable({ auditTrail }: AuditLogTableProps) {
  const initialRowsPerPage = 25;

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
        item.event.toLowerCase().indexOf(search) >= 0 ||
        JSON.stringify(item.eventData).toLowerCase().indexOf(search) >= 0
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
      <div className='audit-trail-table-header'>
        <div className='audit-trail-table-header-right'>
          <div className='audit-trail-search-bar-container'>
            <input
              type='text'
              className='audit-trail-search-bar'
              onChange={handleSearch}
              placeholder='Search audit trail'
              value={searchText}
            />
            <FontAwesomeIcon icon='search' className='audit-trail-search-bar-icon' />
          </div>
        </div>
      </div>
      <table className='audit-log-table'>
        <thead>
          <tr>
            <th>ID</th>
            <SortableTableHeader<AuditTrailDTO> sortKey='userEmail' header='User' />
            <SortableTableHeader<AuditTrailDTO> sortKey='event' header='Event' />
            <th>Event Data</th>
            <SortableTableHeader<AuditTrailDTO> sortKey='updated_at' header='Date' />
            <th>Succeeded</th>
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((log) => (
            <AuditLog key={log.id} log={log} />
          ))}
        </tbody>
      </table>
      <PagingTool
        numberTotalRows={searchedAuditRows.length}
        initialPageNumber={pageNumber}
        onChangeRows={onChangeDisplayedAuditRows}
      />

      {!auditTrail.length && (
        <TableNoDataPlaceholder
          icon={<img src='/document.svg' alt='email-icon' />}
          title='No audit logs for this participant'
        >
          <span>There are no audit logs.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}

export default function AuditTrailTable(props: AuditLogTableProps) {
  return (
    <SortableProvider>
      <AuditLogTable {...props} />
    </SortableProvider>
  );
}