import { Suspense, useCallback, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import BusinessContactsTable from '../components/BusinessContacts/BusinessContactsTable';
import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
import {
  AddEmailContact,
  BusinessContactForm,
  BusinessContactResponse,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import { ApiError } from '../utils/apiError';
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
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  const handleErrorPopup = (e: Error) => {
    const hasHash = Object.hasOwn(e, 'errorHash') && (e as ApiError).errorHash;
    const hash = hasHash ? `: (${(e as ApiError).errorHash})` : '';
    setStatusPopup({
      type: 'Error',
      message: `${e.message}${hash}`,
    });
    setShowStatusPopup(true);
    throw new Error(e.message);
  };

  const handleSuccessPopup = (message: string) => {
    setStatusPopup({
      type: 'Success',
      message,
    });
    setShowStatusPopup(true);
  };

  const handleRemoveEmailContact = async (contactId: number) => {
    try {
      const response = await RemoveEmailContact(contactId);
      if (response.status === 200) {
        handleSuccessPopup('Email contact removed.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorPopup(e as Error);
    }
  };

  const handleUpdateEmailContact = async (contactId: number, formData: BusinessContactForm) => {
    try {
      const response = await UpdateEmailContact(contactId, formData);
      if (response.status === 200) {
        handleSuccessPopup('Email contact updated.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorPopup(e as Error);
    }
  };

  const handleAddEmailContact = async (formData: BusinessContactForm) => {
    try {
      const response = await AddEmailContact(formData);
      if (response.status === 200) {
        handleSuccessPopup('Email contact added.');
      }
      handleBusinessContactUpdated();
    } catch (e: unknown) {
      handleErrorPopup(e as Error);
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
      {statusPopup && (
        <StatusPopup
          status={statusPopup!.type}
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={statusPopup!.message}
        />
      )}
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
