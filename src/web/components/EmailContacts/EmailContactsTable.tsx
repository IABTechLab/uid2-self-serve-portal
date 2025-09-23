import { useState } from 'react';

import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { EmailContactForm, EmailContactResponse } from '../../services/participant';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import EmailContact from './EmailContact';
import EmailContactDialog from './EmailContactDialog';

import './EmailContactsTable.scss';

type EmailContactsTableProps = Readonly<{
  emailContacts: EmailContactResponse[];
  onRemoveEmailContact: (id: number) => Promise<void>;
  onUpdateEmailContact: (id: number, form: EmailContactForm) => Promise<void>;
  onAddEmailContact: (form: EmailContactForm) => Promise<void>;
}>;

function EmailContactsTableContent({
  emailContacts,
  onRemoveEmailContact,
  onUpdateEmailContact,
  onAddEmailContact,
}: EmailContactsTableProps) {
  const [showEmailContactDialog, setShowEmailContactDialog] = useState<boolean>(false);
  const onOpenChangeEmailContactDialog = () => {
    setShowEmailContactDialog(!showEmailContactDialog);
  };

  const { sortData } = useSortable<EmailContactResponse>();
  const sortedEmailContacts = sortData(emailContacts);

  return (
    <div className='email-contacts-table-container'>
      <table className='email-contacts-table'>
        <thead>
          <tr>
            <SortableTableHeader<EmailContactResponse>
              sortKey='name'
              header='Email Group Name'
            />
            <SortableTableHeader<EmailContactResponse>
              sortKey='emailAlias'
              header='Email Alias'
            />
            <SortableTableHeader<EmailContactResponse>
              sortKey='contactType'
              header='Contact Type'
            />
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmailContacts.map((e) => (
            <EmailContact
              key={e.id}
              contact={e}
              onRemoveEmailContact={onRemoveEmailContact}
              onUpdateEmailContact={onUpdateEmailContact}
            />
          ))}
        </tbody>
      </table>

      {!emailContacts.length && (
        <TableNoDataPlaceholder
          icon={<img src='/email-icon.svg' alt='email-icon' />}
          title='No Email Contacts'
        >
          <span>There are no email contacts.</span>
        </TableNoDataPlaceholder>
      )}

      <button className='small-button' type='button' onClick={onOpenChangeEmailContactDialog}>
        Add Email Contact
      </button>
      {showEmailContactDialog && (
        <EmailContactDialog
          onFormSubmit={onAddEmailContact}
          onOpenChange={onOpenChangeEmailContactDialog}
        />
      )}
    </div>
  );
}

export default function EmailContactsTable(props: EmailContactsTableProps) {
  return (
    <SortableProvider>
      <EmailContactsTableContent {...props} />
    </SortableProvider>
  );
}
