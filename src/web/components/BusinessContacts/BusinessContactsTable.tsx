import { useState } from 'react';

import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import BusinessContact from './BusinessContact';
import BusinessContactDialog from './BusinessContactDialog';

import './BusinessContactsTable.scss';

type BusinessContactsTableProps = Readonly<{
  businessContacts: BusinessContactResponse[];
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
  onAddEmailContact: (form: BusinessContactForm) => Promise<void>;
}>;

function BusinessContactsTable({
  businessContacts,
  onRemoveEmailContact,
  onUpdateEmailContact,
  onAddEmailContact,
}: BusinessContactsTableProps) {
  const [showBusinessContactDialog, setShowBusinessContactDialog] = useState<boolean>(false);
  const onOpenChangeBusinessContactDialog = () => {
    setShowBusinessContactDialog(!showBusinessContactDialog);
  };
  return (
    <div className='business-contacts-table-container'>
      <div className='business-contacts-table-header'>
        <div className='business-contacts-table-header-right'>
          <button
            className='small-button'
            type='button'
            onClick={onOpenChangeBusinessContactDialog}
          >
            Add Email Contact
          </button>
        </div>
      </div>
      <table className='business-contacts-table'>
        <thead>
          <tr>
            <th className='name'>Email Group Name</th>
            <th className='email'>Email Alias</th>
            <th className='contactType'>Contact Type</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {businessContacts.map((e) => (
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
          {showBusinessContactDialog && (
            <BusinessContactDialog
              onFormSubmit={onAddEmailContact}
              onOpenChange={onOpenChangeBusinessContactDialog}
            />
          )}
        </TableNoDataPlaceholder>
      )}

      {!!businessContacts.length && (
        <div className='add-new-item'>
          {showBusinessContactDialog && (
            <BusinessContactDialog
              onFormSubmit={onAddEmailContact}
              onOpenChange={onOpenChangeBusinessContactDialog}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessContactsTable;
