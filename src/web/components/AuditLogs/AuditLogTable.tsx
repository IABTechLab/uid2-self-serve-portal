import { useState } from 'react';

import { AuditTrail, AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import AuditLog from './AuditLog';

import './AuditLog.scss';

type AuditLogTableProps = Readonly<{
  auditTrail: AuditTrailDTO[];
  // businessContacts: BusinessContactResponse[];
  // onRemoveEmailContact: (id: number) => Promise<void>;
  // onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
  // onAddEmailContact: (form: BusinessContactForm) => Promise<void>;
}>;

function AuditLogTable({ auditTrail }: AuditLogTableProps) {
  const { sortData } = useSortable<AuditTrailDTO>();
  const sortedAuditLogs = sortData(auditTrail);

  return (
    <div className='audit-log-table-container'>
      <table className='audit-log-table'>
        <thead>
          <tr>
            <th>ID</th>
            <SortableTableHeader<AuditTrailDTO> sortKey='userEmail' header='User' />
            <th>Event</th>
            <th>Date</th>
            {/* <SortableTableHeader<AuditTrailDTO> sortKey='date' header='Date' /> */}
            <th>Succeeded</th>
          </tr>
        </thead>
        <tbody>
          {sortedAuditLogs.map((log) => (
            <AuditLog key={log.id} log={log} />
          ))}
        </tbody>
      </table>

      {!auditTrail.length && (
        <TableNoDataPlaceholder
          icon={<img src='/email-icon.svg' alt='email-icon' />}
          title='No audit logs for this participant'
        >
          <span>There are no audit logs.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}

export default function BusinessContactsTable(props: AuditLogTableProps) {
  return (
    <SortableProvider>
      <AuditLogTable {...props} />
    </SortableProvider>
  );
}
