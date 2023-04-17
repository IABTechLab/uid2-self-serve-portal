import { useContext } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { Form, FormContext } from '../components/Core/Form';
import { Tooltip } from '../components/Core/Tooltip';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { UpdateParticipantForm } from '../services/participant';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function AccountInformationFooter() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('AccountInformationFooter must be used within a FormContext.Provider');
  }
  const { handleSubmit } = context;

  return (
    <div className='dashboard-footer'>
      <div>
        <button className='small-button primary-button' type='button' onClick={handleSubmit}>
          Save & Continue
        </button>
        <button className='transparent-button' type='button'>
          Edit Company Information
        </button>
      </div>
      <p>
        <i>Next: Add Team Members & Contacts</i>
      </p>
      <p className='account-info-footer-text'>
        May need to add a checkbox to highlight that the user is accepting responsibility for
        sharing company data
      </p>
    </div>
  );
}

function AccountInformation() {
  const onSubmit: SubmitHandler<UpdateParticipantForm> = async (formData) => {
    console.log('111');
  };

  const { participant } = useContext(ParticipantContext);
  return (
    <Form<UpdateParticipantForm> customizeSubmit onSubmit={onSubmit}>
      <h1>General Account Information</h1>
      <div className='account-info-content'>
        <h3 className='account-info-title'>
          Company Name
          <Tooltip side='right'>
            If company information needs to be edited, please reach out to support to update
            information.
          </Tooltip>
        </h3>
        <span>{participant?.name}</span>
        <h3 className='account-info-title'>
          Company Type
          <Tooltip side='right'>
            If company information needs to be edited, please reach out to support to update
            information.
          </Tooltip>
        </h3>
        <span>{participant?.types?.join(',')}</span>
        <h2>Company name visible in Sharing Settings</h2>
        <p>
          Making your participant name visible will allow other UID participants who are logged into
          the portal to see your participant’s name within the sharing dropdown (in the sharing
          section) and thus be able to enable sharing.
        </p>
        <p>
          <b>
            Please note if you do not enable this setting other participants will not be able to
            manage their own sharing relationship with you without your involvement.
          </b>
        </p>
        <CheckboxInput
          inputName='allowSharing'
          options={[
            {
              optionLabel: 'Make company name visible',
              value: true,
            },
          ]}
        />
        <TextInput
          inputName='location'
          label='Company Location (optional)'
          className='account-info-input'
        />
        <h3 className='account-info-title'>Company Logo (optional)</h3>
        <p>Please upload your company logo. The following formats are accepted: jpeg, png, jpg.</p>
      </div>
      <AccountInformationFooter />
    </Form>
  );
}

export const AccountInformationRoute: PortalRoute = {
  description: 'General Account Info.',
  element: <AccountInformation />,
  path: '/dashboard/info',
};
