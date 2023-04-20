import { useContext, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Form } from '../components/Core/Form';
import { Tooltip } from '../components/Core/Tooltip';
import { CheckboxInput } from '../components/Input/CheckboxInput';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { UpdateParticipant, UpdateParticipantForm } from '../services/participant';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function AccountInformationFooter() {
  return (
    <div className='dashboard-footer'>
      <div>
        <button className='small-button primary-button' type='submit'>
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
  const { participant } = useContext(ParticipantContext);
  const navigate = useNavigate();
  const defaultFormData = {
    location: participant?.location,
    allowSharing: participant?.allowSharing ? [true] : [],
  };
  const onSubmit: SubmitHandler<UpdateParticipantForm> = async (formData) => {
    await UpdateParticipant(formData, participant!.id);
    navigate('/dashboard/team');
  };
  const participantTypes: string = useMemo(() => {
    return participant?.types?.map((t) => t.typeName).join(', ') ?? '';
  }, [participant]);

  return (
    <Form<UpdateParticipantForm>
      customizeSubmit
      onSubmit={onSubmit}
      defaultValues={defaultFormData}
    >
      <h1>General Account Information</h1>
      <div className='account-info-content'>
        <h3 className='account-info-title'>
          Company Name
          <Tooltip side='right'>
            <span className='account-info-tips'>
              If company information needs to be edited, please reach out to support to update
              information.
            </span>
          </Tooltip>
        </h3>
        <span>{participant?.name}</span>
        <h3 className='account-info-title'>
          Company Type
          <Tooltip side='right'>
            <span className='account-info-tips'>
              If company information needs to be edited, please reach out to support to update
              information.
            </span>
          </Tooltip>
        </h3>
        <span>{participantTypes}</span>
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
