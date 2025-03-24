import { useLocation, useNavigate } from 'react-router-dom';

import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { UserIdParticipantId } from '../../contexts/ParticipantProvider';
import { getPathWithParticipant } from '../../utils/urlHelpers';
import { ParticipantSwitcher } from './ParticipantSwitcher';

import './NoParticipantAccessView.scss';

type NoParticipantAccessViewProps = Readonly<{
  user: UserWithParticipantRoles | null;
}>;

export function NoParticipantAccessView({ user }: NoParticipantAccessViewProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const onBackToParticipant = () => {
    const lastSelectedParticipantIds = (JSON.parse(
      localStorage.getItem('lastSelectedParticipantIds') ?? '{}'
    ) ?? {}) as UserIdParticipantId;
    let participantId = user ? lastSelectedParticipantIds[user.id] : undefined;
    if (!participantId && user?.participants && user?.participants.length > 0) {
      participantId = user.participants[0].id;
    }
    if (participantId) {
      const newPath = getPathWithParticipant(location.pathname, participantId);
      navigate(newPath);
    }
  };

  return (
    <div className='no-participant-access-container'>
      <p className='no-access-text instructions'>You do not have access to this participant.</p>

      {(user?.participants?.length ?? 0) > 1 && (
        <>
          <p className='use-switcher-text instructions'>
            Use the dropdown below to navigate to a participant you have access to.
          </p>
          <div className='switcher'>
            <ParticipantSwitcher noInitialValue />
          </div>
        </>
      )}
      {user?.participants?.length === 1 && (
        <div>
          <button className='small-button' type='button' onClick={onBackToParticipant}>
            Back to Your Participant
          </button>
        </div>
      )}
    </div>
  );
}
