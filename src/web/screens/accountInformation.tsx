import { useContext } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

import { Banner } from '../components/Core/Banner';
import { Form } from '../components/Core/Form';
import { Tooltip } from '../components/Core/Tooltip';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { UpdateParticipantForm } from '../services/participant';
import { PortalRoute } from './routeUtils';
import TermsAndConditionsDialog from './termsAndConditionsDialog';

import './accountInformation.scss';

function NameInvisibleBanner() {
  const { watch } = useFormContext<UpdateParticipantForm>();
  const watchNameVisible = watch('allowSharing');
  if (watchNameVisible) return null;
  return (
    <Banner
      className='name-invisible-warning'
      message='If you disable this setting, other participants will not see your participant name on the Sharing Relationship list.'
    />
  );
}

function AccountInformation() {
  const onSubmit: SubmitHandler<UpdateParticipantForm> = async () => {};

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
        <h2>Show participant name in Sharing Relationships settings</h2>
        <p>
          Making your participant name visible allows other UID2 participants who are choosing
          sharing relationships to see your name on the list.
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
        <NameInvisibleBanner />
        <TextInput
          inputName='location'
          label='Company Location (optional)'
          className='account-info-input'
        />
      </div>
      <div className='dashboard-footer'>
        <div>
          <TermsAndConditionsDialog />
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
    </Form>
  );
}

export const AccountInformationRoute: PortalRoute = {
  description: 'General Account Info.',
  element: <AccountInformation />,
  path: '/dashboard/info',
};
