import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import BusinessContactsTable from '../components/BusinessContacts/BusinessContactsTable';
import { SuccessToast } from '../components/Core/Toast';
import {
  AddEmailContact,
  BusinessContactForm,
  BusinessContactResponse,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './emailContacts.scss';

function Loading() {
  return <div>Loading business contacts...</div>;
}

export function BusinessContacts() {
  const data = useLoaderData() as { emailContacts: BusinessContactResponse[] };
  const reloader = useRevalidator();
  const handleBusinessContactUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleRemoveEmailContact = async (contactId: number) => {
    try {
      const response = await RemoveEmailContact(contactId);
      if (response.status === 200) {
        SuccessToast('Email contact removed.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleUpdateEmailContact = async (contactId: number, formData: BusinessContactForm) => {
    try {
      const response = await UpdateEmailContact(contactId, formData);
      if (response.status === 200) {
        SuccessToast('Email contact updated.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleAddEmailContact = async (formData: BusinessContactForm) => {
    try {
      const response = await AddEmailContact(formData);
      if (response.status === 201) {
        SuccessToast('Email contact added.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  return (
    <div className='portal-business-contact'>
      <h1>Email Contacts</h1>
      <p className='heading-details'>
        View and manage email contacts. We’ll send information about the latest updates and releases
        for UID2.
      </p>
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
    </div>
  );
}

export const EmailContactsRoute: PortalRoute = {
  description: 'Email Contacts',
  element: <BusinessContacts />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/emailContacts',
  loader: () => {
    const emailContacts = GetEmailContacts();
    return defer({ emailContacts });
  },
};
