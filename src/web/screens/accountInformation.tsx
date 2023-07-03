import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Tooltip } from '../components/Core/Tooltip';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function AccountInformationFooter() {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/dashboard/team');
  };
  return (
    <div className='dashboard-footer'>
      <div>
        <button className='small-button primary-button' type='button' onClick={onClick}>
          Continue
        </button>
      </div>
      <p>
        <i>Next: Add Team Members & Contacts</i>
      </p>
    </div>
  );
}

function AccountInformation() {
  const { participant } = useContext(ParticipantContext);
  const participantTypes: string = useMemo(() => {
    return participant?.types?.map((t) => t.typeName).join(', ') ?? '';
  }, [participant]);

  return (
    <>
      <h1>General Account Information</h1>
      <p>View and manage your participant information and default sharing settings.</p>
      <div className='account-info-content'>
        <h3 className='account-info-title'>
          Participant Name
          <Tooltip side='right'>
            For any changes to participant information, please contact Support.
          </Tooltip>
        </h3>
        <span>{participant?.name}</span>
        <h3 className='account-info-title'>
          Participant Type
          <Tooltip side='right'>
            For any changes to participant information, please contact Support.
          </Tooltip>
        </h3>
        <span>{participantTypes}</span>
      </div>
      <AccountInformationFooter />
    </>
  );
}

export const AccountInformationRoute: PortalRoute = {
  description: 'General Account Info.',
  element: <AccountInformation />,
  path: '/dashboard/info',
};
