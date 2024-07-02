import { useContext } from 'react';

import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { Tooltip } from '../components/Core/Tooltip/Tooltip';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './participantInformation.scss';

function ParticipantInformation() {
  const { participant } = useContext(ParticipantContext);
  const participantTypes = participant?.types?.map((t) => t.typeName).join(', ') ?? '';

  return (
    <>
      <h1>Participant Information</h1>
      <p className='heading-details'>View and manage your participant information.</p>
      <ScreenContentContainer>
        <div>
          <h3 className='participant-info-title'>
            Participant Name
            <Tooltip side='right'>
              For any changes to participant information, please contact Support.
            </Tooltip>
          </h3>
          <span>{participant?.name}</span>
        </div>
        <div>
          <h3 className='participant-info-title'>
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

export const ParticipantInformationRoute: PortalRoute = {
  description: 'Participant Information',
  element: <ParticipantInformation />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/info',
  isHidden: true,
};
