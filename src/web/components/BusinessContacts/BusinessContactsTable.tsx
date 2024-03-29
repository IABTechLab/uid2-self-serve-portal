import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import BusinessContact from './BusinessContact';
import BusinessContactDialog from './BusinessContactDialog';

import './BusinessContactsTable.scss';

function NoEmailContact({
  onAddEmailContact,
}: {
  onAddEmailContact: (form: BusinessContactForm) => Promise<void>;
}) {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/email-icon.svg' alt='email-icon' />}
      title='No Email Contacts'
    >
      <BusinessContactDialog
        onFormSubmit={onAddEmailContact}
        triggerButton={
          <button className='transparent-button' type='button'>
            Add Email Contact
          </button>
        }
      />
    </TableNoDataPlaceholder>
  );
}

type BusinessContactsTableProps = {
  businessContacts: BusinessContactResponse[];
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
  onAddEmailContact: (form: BusinessContactForm) => Promise<void>;
};

function BusinessContactsTable({
  businessContacts,
  onRemoveEmailContact,
  onUpdateEmailContact,
  onAddEmailContact,
}: BusinessContactsTableProps) {
  return (
    <div className='business-contacts-table-container'>
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
      {!businessContacts.length && <NoEmailContact onAddEmailContact={onAddEmailContact} />}
      {!!businessContacts.length && (
        <div className='add-new-item'>
          <BusinessContactDialog
            onFormSubmit={onAddEmailContact}
            triggerButton={
              <button className='small-button' type='button'>
                Add Email Contact
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}

export default BusinessContactsTable;
