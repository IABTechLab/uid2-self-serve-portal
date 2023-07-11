import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useState } from 'react';

import { User } from '../../../api/entities/User';

type TeamMemberProps = { person: User; resendInvite: (id: number) => Promise<void> };

enum InviteState {
  initial,
  inProgress,
  sent,
  error,
}
function TeamMember({ person, resendInvite }: TeamMemberProps) {
  const [reinviteState, setInviteState] = useState<InviteState>(InviteState.initial);
  const onResendInvite = useCallback(async () => {
    if (reinviteState !== InviteState.initial) {
      log.error(`Unexpected click event on reinvite button`);
      return;
    }

    setInviteState(InviteState.inProgress);
    try {
      await resendInvite(person.id);
      setInviteState(InviteState.sent);
    } catch {
      setInviteState(InviteState.error);
    }
  }, [person.id, reinviteState, resendInvite]);
  return (
    <tr>
      <td>{`${person.firstName} ${person.lastName}`}</td>
      <td>{person.email}</td>
      <td className='action'>
        {person.acceptedTerms || (
          <button
            type='button'
            className={clsx({
              clickable: reinviteState === InviteState.initial,
              error: reinviteState === InviteState.error,
            })}
            onClick={() => onResendInvite()}
          >
            {reinviteState === InviteState.initial && 'Resend Invitation'}
            {reinviteState === InviteState.inProgress && 'Sending...'}
            {reinviteState === InviteState.sent && 'Invitation Sent'}
            {reinviteState === InviteState.error && 'Try again later'}
          </button>
        )}
        <FontAwesomeIcon icon='pencil' />
        <FontAwesomeIcon icon='trash-can' />
      </td>
    </tr>
  );
}

export default TeamMember;
