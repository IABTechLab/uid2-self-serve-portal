import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Banner } from '../components/Core/Banner';
import FormSubmitButton from '../components/Core/FormSubmitButton';
import { TextInput } from '../components/Input/TextInput';
import { SelfResendInvitation, SelfResendInvitationForm } from '../services/userAccount';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './selfReinvite.scss';

function SelfReinvite() {
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const emailParam = queryParams.get('email');
  const formMethods = useForm<SelfResendInvitationForm>({
    defaultValues: { email: emailParam ?? undefined },
  });
  const { handleSubmit } = formMethods;

  const onSubmit = async (formData: SelfResendInvitationForm) => {
    try {
      await SelfResendInvitation(formData);
      setShowSuccessBanner(true);
    } catch (e) {
      handleErrorToast(e);
    }
  };

  return (
    <div className='self-reinvite'>
      {showSuccessBanner && (
        <Banner
          message="If we have an active invitation for you, we'll send you an email shortly with further instructions. If you continue to have trouble, contact support."
          type='Success'
          fitContent
        />
      )}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className='self-reinvite-form'>
          <h1>Resend Invitation</h1>
          <TextInput inputName='email' label='Email' disabled />
          <FormSubmitButton>Resend Invitation</FormSubmitButton>
        </form>
      </FormProvider>
    </div>
  );
}

export const SelfReinviteRoute: PortalRoute = {
  description: 'Self Re-invite',
  element: <SelfReinvite />,
  errorElement: <RouteErrorBoundary />,
  path: '/selfReinvite',
};
