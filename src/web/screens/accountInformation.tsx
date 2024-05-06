import { useContext, useMemo } from 'react';

import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { Tooltip } from '../components/Core/Tooltip';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
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
      <p className='heading-details'>View and manage your participant information.</p>
      <ScreenContentContainer>
        <div>
          <h3 className='account-info-title'>
            Participant Name
            <Tooltip side='right'>
              For any changes to participant information, please contact Support.
            </Tooltip>
          </h3>
          <span>{participant?.name}</span>
        </div>
        <div>
          <h3 className='account-info-title'>
            Participant Type
            <Tooltip side='right'>
              For any changes to participant information, please contact Support.
            </Tooltip>
          </h3>
          <span>{participantTypes}</span>
        </div>
      </ScreenContentContainer>
    </>
  );
}

export const AccountInformationRoute: PortalRoute = {
  description: 'Participant Information',
  element: <AccountInformation />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/info',
};
