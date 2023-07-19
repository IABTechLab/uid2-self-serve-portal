import { useContext, useMemo } from 'react';

import { Tooltip } from '../components/Core/Tooltip';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function AccountInformation() {
  const { participant } = useContext(ParticipantContext);
  const participantTypes: string = useMemo(() => {
    return participant?.types?.map((t) => t.typeName).join(', ') ?? '';
  }, [participant]);

  return (
    <>
      <h1>Participant Information</h1>
      <p>View and manage your participant information.</p>
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
    </>
  );
}

export const AccountInformationRoute: PortalRoute = {
  description: 'Participant Information',
  element: <AccountInformation />,
  path: '/dashboard/info',
};
