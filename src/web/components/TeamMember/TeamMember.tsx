import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useState } from 'react';

import { InviteTeamMemberForm, UserResponse } from '../../services/userAccount';
import TeamMemberDialog from './TeamMemberDialog';

type TeamMemberProps = {
  person: UserResponse;
  resendInvite: (id: number) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (id: number, form: InviteTeamMemberForm) => Promise<void>;
};

enum InviteState {
  initial,
  inProgress,
  sent,
  error,
}
function TeamMember({
  person,
  resendInvite,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: TeamMemberProps) {
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

  const handleRemoveUser = async () => {
    await onRemoveTeamMember(person.id);
  };

  const handleUpdateUser = async (formData: InviteTeamMemberForm) => {
    await onUpdateTeamMember(person.id, formData);
  };

  return (
    <tr>
      <td>
        <div className='name-cell'>
          {`${person.firstName} ${person.lastName}`}
          {person.acceptedTerms || <div className='pending-label'>Pending</div>}
        </div>
      </td>
      <td>{person.email}</td>
      <td className='action'>
        {person.acceptedTerms || (
          <button
            type='button'
            className={clsx('invite-button', {
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
        <TeamMemberDialog
          onFormSubmit={handleUpdateUser}
          person={person}
          triggerButton={
            <button className='icon-button' aria-label='edit' type='button'>
              <FontAwesomeIcon icon='pencil' />
            </button>
          }
        />
        <button
          className='icon-button'
          aria-label='delete'
          type='button'
          onClick={handleRemoveUser}
        >
          <FontAwesomeIcon icon='trash-can' />
        </button>
      </td>
    </tr>
  );
}

export default TeamMember;
