import { ParticipantSwitcher } from './ParticipantSwitcher';

import './NoParticipantAccessView.scss';

export function NoParticipantAccessView() {
  return (
    <div className='no-participant-access-container'>
      <p className='no-access-text instructions'>You do not have access to this participant.</p>
      <p className='use-switcher-text instructions'>
        Use the dropdown below to navigate to a participant you have access to.
      </p>
      <div className='switcher'>
        <ParticipantSwitcher noInitialValue />
      </div>
    </div>
  );
}
