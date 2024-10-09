import { ParticipantSwitcher } from './ParticipantSwitcher';

import './NoParticipantAccessView.scss';
import { useContext } from 'react';
import { CurrentUserContext } from '../../contexts/CurrentUserProvider';

export function NoParticipantAccessView() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  return (
    <div className='no-participant-access-switcher'>
      <p className='no-access instructions'>You do not have access to this participant.</p>
      <p className='use-switcher instructions'>
        Use the switcher below to navigate to a participant you have access to.
      </p>
      <div className='switcher'>
        <ParticipantSwitcher />
      </div>
    </div>
  );
}
