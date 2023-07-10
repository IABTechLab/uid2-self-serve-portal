import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

import {
  AddEmailContact,
  BusinessContactForm,
  BusinessContactResponse,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import BusinessContactDialog from './businessContactDialog';
import { PortalRoute } from './routeUtils';

import './businessContacts.scss';

function NoEmailContact({ onBusinessContactUpdated }: { onBusinessContactUpdated: () => void }) {
  return (
    <div className='no-contacts-container'>
      <img src='/email-icon.svg' alt='email-icon' />
      <div className='no-contacts-text'>
        <h2>No Email Contacts</h2>
        <BusinessContactDialog
          onFormSubmit={AddEmailContact}
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

type EmailContactProps = { contact: BusinessContactResponse; onBusinessContactUpdated: () => void };

function EmailContact({ contact, onBusinessContactUpdated }: EmailContactProps) {
  const removeEmailContact = async () => {
    await RemoveEmailContact(contact.id);
    onBusinessContactUpdated();
  };

  const updateEmailContact = async (formData: BusinessContactForm) => {
    await UpdateEmailContact(contact.id, formData);
  };

  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.emailAlias}</td>
      <td>{contact.contactType}</td>
      <td className='action'>
        <BusinessContactDialog
          onFormSubmit={updateEmailContact}
          onFormSubmitted={onBusinessContactUpdated}
          contact={contact}
          triggerButton={
            <button className='icon-button' aria-label='edit' type='button'>
              <FontAwesomeIcon icon='pencil' />
            </button>
          }
        />
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
  const navigate = useNavigate();
  const data = useLoaderData() as { emailContacts: BusinessContactResponse[] };
  const reloader = useRevalidator();
  const onBusinessContactUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  // TODO: update to Participation Policy page
  const onClick = () => {
    navigate('/');
  };

  return (
    <div className='portal-business-contact'>
      <h1>Email Contacts</h1>
      <p className='heading-details'>
        View and manage email contacts. We’ll send information about the latest updates and releases
        for UID2.
      </p>
      <h2>Team Members</h2>
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
                <NoEmailContact onBusinessContactUpdated={onBusinessContactUpdated} />
              )}
              {!!emailContacts.length && (
                <div className='add-new-item'>
                  <BusinessContactDialog
                    onFormSubmit={AddEmailContact}
                    onFormSubmitted={onBusinessContactUpdated}
                    triggerButton={
                      <button className='small-button' type='button'>
                        Add Email Contact
                      </button>
                    }
                  />
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
