import { Suspense } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import BusinessContactsTable from '../components/BusinessContacts/BusinessContactsTable';
import { Loading } from '../components/Core/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { SuccessToast } from '../components/Core/Toast';
import {
  AddEmailContact,
  BusinessContactForm,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import { handleErrorToast } from '../utils/apiError';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './emailContacts.scss';

const loader = makeLoader(() => {
  const emailContacts = GetEmailContacts();
  return defer({ emailContacts });
});

export function BusinessContacts() {
  const data = useLoaderData<typeof loader>();
  const reloader = useRevalidator();

  const handleRemoveEmailContact = async (contactId: number) => {
    try {
      const response = await RemoveEmailContact(contactId);
      if (response.status === 200) {
        SuccessToast('Email contact removed.');
      }
      reloader.revalidate();
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
      reloader.revalidate();
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
      reloader.revalidate();
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
      <ScreenContentContainer>
        <Suspense fallback={<Loading innerText='Loading business contacts...' />}>
          <AwaitTypesafe resolve={data.emailContacts}>
            {(emailContacts) => (
              <BusinessContactsTable
                businessContacts={emailContacts}
                onRemoveEmailContact={handleRemoveEmailContact}
                onUpdateEmailContact={handleUpdateEmailContact}
                onAddEmailContact={handleAddEmailContact}
              />
            )}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </div>
  );
}

export const EmailContactsRoute: PortalRoute = {
  description: 'Email Contacts',
  element: <BusinessContacts />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/emailContacts',
  loader,
};
