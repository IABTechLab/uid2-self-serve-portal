import { BusinessContactForm, BusinessContactResponse } from '../../services/participant';
import BusinessContact from './BusinessContact';
import BusinessContactDialog from './BusinessContactDialog';

import './BusinessContactsTable.scss';

function NoEmailContact({
  addEmailContact,
  onBusinessContactUpdated,
}: {
  addEmailContact: (form: BusinessContactForm) => Promise<void>;
  onBusinessContactUpdated: () => void;
}) {
  return (
    <div className='no-contacts-container'>
      <img src='/email-icon.svg' alt='email-icon' />
      <div className='no-contacts-text'>
        <h2>No Email Contacts</h2>
        <BusinessContactDialog
          onFormSubmit={addEmailContact}
          onFormSubmitted={onBusinessContactUpdated}
          triggerButton={
            <button className='transparent-button' type='button'>
              Add Email Contact
            </button>
          }
        />
      </div>
    </div>
  );
}

type BusinessContactsTableProps = {
  businessContacts: BusinessContactResponse[];
  removeEmailContact: (id: number) => Promise<void>;
  updateEmailContact: (id: number, form: BusinessContactForm) => Promise<void>;
  addEmailContact: (form: BusinessContactForm) => Promise<void>;
  onBusinessContactUpdated: () => void;
};

function BusinessContactsTable({
  businessContacts,
  removeEmailContact,
  updateEmailContact,
  addEmailContact,
  onBusinessContactUpdated,
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
              removeEmailContact={removeEmailContact}
              updateEmailContact={updateEmailContact}
              onBusinessContactUpdated={onBusinessContactUpdated}
            />
          ))}
        </tbody>
      </table>
      {!businessContacts.length && (
        <NoEmailContact
          onBusinessContactUpdated={onBusinessContactUpdated}
          addEmailContact={addEmailContact}
        />
      )}
      {!!businessContacts.length && (
        <div className='add-new-item'>
          <BusinessContactDialog
            onFormSubmit={addEmailContact}
            onFormSubmitted={onBusinessContactUpdated}
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
