import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, Suspense, useCallback } from 'react';
import { Await, useLoaderData, useRevalidator } from 'react-router-dom';

import { BusinessContactResponse, RemoveEmailContact } from '../services/participant';
import AddBusinessContactDialog from './addBusinessContactDialog';

import './businessContacts.scss';

function NoEmailContact({ children }: { children: ReactNode }) {
  return (
    <div className='no-contacts-container'>
      <img src='/email-icon.svg' alt='email-icon' />
      <div className='no-contacts-text'>
        <h2>No Email Contacts</h2>
        {children}
      </div>
    </div>
  );
}

type EmailContactProps = { contact: BusinessContactResponse; onBusinessContactUpdated: () => void };

function EmailContact({ contact, onBusinessContactUpdated }: EmailContactProps) {
  const removeEmailContact = async () => {
    await RemoveEmailContact(contact.id);
    onBusinessContactUpdated();
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <button className='icon-button' aria-label='edit' type='button'>
          <FontAwesomeIcon icon='pencil' />
        </button>
        <button
          className='icon-button'
          aria-label='delete'
          type='button'
          onClick={removeEmailContact}
        >
          <FontAwesomeIcon icon='trash-can' />
        </button>
      </td>
    </tr>
  );
}

function Loading() {
  return <div>Loading business contacts...</div>;
}

export function BusinessContacts() {
  const data = useLoaderData() as { emailContacts: BusinessContactResponse[] };
  const reloader = useRevalidator();
  const onBusinessContactUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data.emailContacts}>
        {(emailContacts: BusinessContactResponse[]) => (
          <>
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
                {emailContacts.map((e) => (
                  <EmailContact
                    key={e.id}
                    contact={e}
                    onBusinessContactUpdated={onBusinessContactUpdated}
                  />
                ))}
              </tbody>
            </table>
            {!emailContacts.length && (
              <NoEmailContact>
                <AddBusinessContactDialog onAddBusinessContact={onBusinessContactUpdated} />
              </NoEmailContact>
            )}
            {!!emailContacts.length && (
              <div className='add-new-item'>
                <AddBusinessContactDialog onAddBusinessContact={onBusinessContactUpdated} />
              </div>
            )}
          </>
        )}
      </Await>
    </Suspense>
  );
}
