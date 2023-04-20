import { useContext } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { Form } from '../components/Core/Form';
import { Tooltip } from '../components/Core/Tooltip';
import { TextInput } from '../components/Input/TextInput';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { UpdateParticipantForm } from '../services/participant';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function AccountInformationFooter() {
  return (
    <div className='dashboard-footer'>
      <div>
        <button className='small-button primary-button' type='submit'>
          Save & Continue
        </button>
      </div>
      <p>
        <i>Next: Add Team Members & Contacts</i>
      </p>
    </div>
  );
}

function AccountInformation() {
  const onSubmit: SubmitHandler<UpdateParticipantForm> = async () => {};

  const { participant } = useContext(ParticipantContext);
  return (
    <Form<UpdateParticipantForm> customizeSubmit onSubmit={onSubmit}>
      <h1>General Account Information</h1>
      <p>View and manage your participant information and default sharing settings.</p>
      <div className='account-info-content'>
        <h3 className='account-info-title'>
          Participant Name
          <Tooltip side='right'>
            <span className='account-info-tips'>
              If company information needs to be edited, please reach out to support to update
              information.
            </span>
          </Tooltip>
        </h3>
        <span>{participant?.name}</span>
        <h3 className='account-info-title'>
          Participant Type
          <Tooltip side='right'>
            <span className='account-info-tips'>
              If company information needs to be edited, please reach out to support to update
              information.
            </span>
          </Tooltip>
        </h3>
        <span>{participant?.types?.join(',')}</span>
        <TextInput
          inputName='location'
          label='Participant Location (optional)'
          className='account-info-input'
        />
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
