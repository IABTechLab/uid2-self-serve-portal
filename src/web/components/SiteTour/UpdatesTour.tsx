import Joyride, { Actions, CallBackProps } from 'react-joyride';

import { GetTourSteps, markTourAsSeen, ShouldShowTour } from './tourStorage';

function callback(data: CallBackProps) {
  const doNotShowAgainActions: Actions[] = ['close', 'skip', 'stop', 'reset'];
  if (doNotShowAgainActions.includes(data.action)) markTourAsSeen();
}

export function UpdatesTour() {
  const tourSteps = GetTourSteps();
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
