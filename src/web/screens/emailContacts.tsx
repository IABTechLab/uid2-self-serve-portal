import { Suspense, useContext } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import EmailContactsTable from '../components/EmailContacts/EmailContactsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddEmailContact,
  EmailContactForm,
  GetEmailContacts,
  RemoveEmailContact,
  UpdateEmailContact,
} from '../services/participant';
import { handleErrorToast } from '../utils/apiError';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './emailContacts.scss';

const loader = makeParticipantLoader((participantId) => {
  const emailContacts = GetEmailContacts(participantId);
  return defer({ emailContacts });
});

export function EmailContacts() {
  const data = useLoaderData<typeof loader>();
  const { participant } = useContext(ParticipantContext);
  const reloader = useRevalidator();

  const handleRemoveEmailContact = async (contactId: number) => {
    try {
      const response = await RemoveEmailContact(contactId, participant!.id);
      if (response.status === 200) {
        SuccessToast('Email contact removed.');
      }
      reloader.revalidate();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleUpdateEmailContact = async (contactId: number, formData: EmailContactForm) => {
    try {
      const response = await UpdateEmailContact(contactId, formData, participant!.id);
      if (response.status === 200) {
        SuccessToast('Email contact updated.');
      }
      reloader.revalidate();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleAddEmailContact = async (formData: EmailContactForm) => {
    try {
      const response = await AddEmailContact(formData, participant!.id);
      if (response.status === 201) {
        SuccessToast('Email contact added.');
      }
      reloader.revalidate();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  return (
    <div className='portal-email-contact'>
      <h1>Email Contacts</h1>
      <p className='heading-details'>
        View and manage email contacts. We’ll send information about the latest updates and releases
        for UID2.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading email contacts...' />}>
          <AwaitTypesafe resolve={data.emailContacts}>
            {(emailContacts) => (
              <EmailContactsTable
                emailContacts={emailContacts}
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
  element: <EmailContacts />,
  errorElement: <RouteErrorBoundary />,
  path: '/participant/:participantId/emailContacts',
  loader,
  isHidden: true,
};
