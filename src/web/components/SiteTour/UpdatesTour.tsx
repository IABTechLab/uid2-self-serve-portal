import { useContext } from 'react';
import Joyride, { Actions, CallBackProps } from 'react-joyride';

import { CurrentUserContext } from '../../contexts/CurrentUserProvider';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { GetTourSteps, markTourAsSeen } from './tourStorage';

function callback(data: CallBackProps) {
  const doNotShowAgainActions: Actions[] = ['close', 'skip', 'stop', 'reset'];
  if (doNotShowAgainActions.includes(data.action)) markTourAsSeen();
}

export function UpdatesTour() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const { participant } = useContext(ParticipantContext);
  const tourSteps = GetTourSteps(LoggedInUser, participant);
  const showTour = tourSteps.length > 0;
  const actionButtonStyle = {
    backgroundColor: '#cdf200', // --theme-button
    color: '#030a40', // --theme-button-text
  };
  const secondaryButtonStyle = {
    color: '#333', // Default text color for Joyride
  };

  return (
    <div>
      {showTour && (
        <Joyride
          steps={tourSteps}
          callback={callback}
          continuous
          showSkipButton
          locale={{
            last: 'Finish Tour',
          }}
          styles={{
            buttonNext: actionButtonStyle,
            buttonBack: secondaryButtonStyle,
          }}
        />
      )}
    </div>
  );
}
