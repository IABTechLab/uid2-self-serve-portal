import { ParticipantSwitcher } from './ParticipantSwitcher';

import './NoParticipantAccessView.scss';
import { UserWithParticipantRoles } from '../../../api/services/usersService';

type NoParticipantAccessViewProps = Readonly<{
  user: UserWithParticipantRoles | null;
}>;

export function NoParticipantAccessView({ user }: NoParticipantAccessViewProps) {
  return (
    <div className='no-participant-access-container'>
      <p className='no-access-text instructions'>You do not have access to this participant.</p>
      <p className='use-switcher-text instructions'>
        Use the dropdown below to navigate to a participant you have access to.
      </p>
      {(user?.participants?.length ?? 0) > 1 ? (
        <div className='switcher'>
          <ParticipantSwitcher noInitialValue />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
