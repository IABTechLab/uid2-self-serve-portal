import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

import BusinessContactsTable from '../components/BusinessContacts/BusinessContactsTable';
import {
  AddEmailContact,
  BusinessContactForm,
  BusinessContactResponse,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import { PortalRoute } from './routeUtils';

import './emailContacts.scss';

function Loading() {
  return <div>Loading business contacts...</div>;
}

export function BusinessContacts() {
  const navigate = useNavigate();
  const data = useLoaderData() as { emailContacts: BusinessContactResponse[] };
  const reloader = useRevalidator();
  const handleBusinessContactUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  // TODO: update to Participation Policy page
  const onClick = () => {
    navigate('/');
  };

  const handleRemoveEmailContact = async (contactId: number) => {
    await RemoveEmailContact(contactId);
    handleBusinessContactUpdated();
  };

  const handleUpdateEmailContact = async (contactId: number, formData: BusinessContactForm) => {
    await UpdateEmailContact(contactId, formData);
    handleBusinessContactUpdated();
  };

  const handleAddEmailContact = async (formData: BusinessContactForm) => {
    await AddEmailContact(formData);
    handleBusinessContactUpdated();
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
            <BusinessContactsTable
              businessContacts={emailContacts}
              onRemoveEmailContact={handleRemoveEmailContact}
              onUpdateEmailContact={handleUpdateEmailContact}
              onAddEmailContact={handleAddEmailContact}
            />
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
