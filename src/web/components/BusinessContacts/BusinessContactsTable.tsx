import { useState } from 'react';

import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { SortableTableHeader } from '../Core/Headers/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Views/TableNoDataPlaceholder';
import BusinessContact from './BusinessContact';
import BusinessContactDialog from './BusinessContactDialog';

import './BusinessContactsTable.scss';

type BusinessContactsTableProps = Readonly<{
  businessContacts: BusinessContactResponse[];
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
  onAddEmailContact: (form: BusinessContactForm) => Promise<void>;
}>;

function BusinessContactsTableContent({
  businessContacts,
  onRemoveEmailContact,
  onUpdateEmailContact,
  onAddEmailContact,
}: BusinessContactsTableProps) {
  const [showBusinessContactDialog, setShowBusinessContactDialog] = useState<boolean>(false);
  const onOpenChangeBusinessContactDialog = () => {
    setShowBusinessContactDialog(!showBusinessContactDialog);
  };

  const { sortData } = useSortable<BusinessContactResponse>();
  const sortedBusinessContacts = sortData(businessContacts);

  return (
    <div className='business-contacts-table-container'>
      <table className='business-contacts-table'>
        <thead>
          <tr>
            <SortableTableHeader<BusinessContactResponse>
              sortKey='name'
              header='Email Group Name'
            />
            <SortableTableHeader<BusinessContactResponse>
              sortKey='emailAlias'
              header='Email Alias'
            />
            <SortableTableHeader<BusinessContactResponse>
              sortKey='contactType'
              header='Contact Type'
            />
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBusinessContacts.map((e) => (
            <BusinessContact
              key={e.id}
              contact={e}
              onRemoveEmailContact={onRemoveEmailContact}
              onUpdateEmailContact={onUpdateEmailContact}
            />
          ))}
        </tbody>
      </table>

      {!businessContacts.length && (
        <TableNoDataPlaceholder
          icon={<img src='/email-icon.svg' alt='email-icon' />}
          title='No Email Contacts'
        >
          <span>There are no email contacts.</span>
        </TableNoDataPlaceholder>
      )}

      <button className='small-button' type='button' onClick={onOpenChangeBusinessContactDialog}>
        Add Email Contact
      </button>
      {showBusinessContactDialog && (
        <BusinessContactDialog
          onFormSubmit={onAddEmailContact}
          onOpenChange={onOpenChangeBusinessContactDialog}
        />
      )}
    </div>
  );
}

export default function BusinessContactsTable(props: BusinessContactsTableProps) {
  return (
    <SortableProvider>
      <BusinessContactsTableContent {...props} />
    </SortableProvider>
  );
}
