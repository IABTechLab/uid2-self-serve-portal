import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

import { EmailContactResponse, GetEmailContacts } from '../services/participant';
import BusinessContactDialog from './businessContactDialog';
import { PortalRoute } from './routeUtils';

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
  const navigate = useNavigate();
  const data = useLoaderData() as { emailContacts: EmailContactResponse[] };
  const reloader = useRevalidator();
  const onAddBusinessContact = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  // TODO: update to Participation Policy page
  const onClick = () => {
    navigate('/');
  };
  return (
    <div className='portal-team'>
      <h1>Email Contacts</h1>
      <p className='heading-details'>
        View and manage email contacts. We’ll send information about the latest updates and releases
        for UID2.
      </p>
      <h2>Team Members</h2>
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
                  <BusinessContactDialog onAddBusinessContact={onAddBusinessContact} />
                </NoEmailContact>
              )}
              {!!emailContacts.length && (
                <div className='add-new-item'>
                  <BusinessContactDialog onAddBusinessContact={onAddBusinessContact} />
                </div>
              )}
            </>
          )}
        </Await>
      </Suspense>
      <div className='dashboard-footer'>
        <div>
          <button className='small-button primary-button' type='button' onClick={onClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export const EmailContactsRoute: PortalRoute = {
  description: 'Email Contacts',
  element: <BusinessContacts />,
  path: '/dashboard/emailContacts',
  loader: () => {
    const emailContacts = GetEmailContacts();
    return defer({ emailContacts });
  },
};
