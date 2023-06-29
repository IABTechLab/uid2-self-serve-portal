import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, Suspense, useCallback } from 'react';
import { Await, useLoaderData, useRevalidator } from 'react-router-dom';

import { EmailContactResponse } from '../services/participant';
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

type EmailContactProps = { contact: EmailContactResponse };

function EmailContact({ contact }: EmailContactProps) {
  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <FontAwesomeIcon icon='pencil' />
        <FontAwesomeIcon icon='trash-can' />
      </td>
    </tr>
  );
}

function Loading() {
  return <div>Loading business contacts...</div>;
}

export function BusinessContacts() {
  const data = useLoaderData() as { emailContacts: EmailContactResponse[] };
  const reloader = useRevalidator();
  const onAddBusinessContact = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data.emailContacts}>
        {(emailContacts: EmailContactResponse[]) => (
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
                  <EmailContact key={e.id} contact={e} />
                ))}
              </tbody>
            </table>
            {!emailContacts.length && (
              <NoEmailContact>
                <AddBusinessContactDialog onAddBusinessContact={onAddBusinessContact} />
              </NoEmailContact>
            )}
            {!!emailContacts.length && (
              <div className='add-new-item'>
                <AddBusinessContactDialog onAddBusinessContact={onAddBusinessContact} />
              </div>
            )}
          </>
        )}
      </Await>
    </Suspense>
  );
}
