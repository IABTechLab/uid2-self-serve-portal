import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useState } from 'react';

import { UpdateTeamMemberForm, UserResponse } from '../../services/userAccount';
import { handleErrorToast } from '../../utils/apiError';
import ActionButton from '../Core/ActionButton';
import { InlineMessage } from '../Core/InlineMessage';
import { SuccessToast } from '../Core/Toast';
import TeamMemberDeleteConfirmationDialog from './TeamMemberDeleteDialog';
import TeamMemberDialog from './TeamMemberDialog';

type TeamMemberProps = Readonly<{
  person: UserResponse;
  resendInvite: (id: number) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
}>;

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
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>();
  const [showDeleteTeamMemberDialog, setShowDeleteTeamMemberDialog] = useState<boolean>();

  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  const onOpenChangeTeamMemberDialog = () => {
    setShowTeamMemberDialog(!showTeamMemberDialog);
  };

  const onOpenChangeDeleteTeamMemberDialog = () => {
    setShowDeleteTeamMemberDialog(!showDeleteTeamMemberDialog);
  };

  const onResendInvite = useCallback(async () => {
    if (reinviteState !== InviteState.initial) {
      log.error(`Unexpected click event on reinvite button`);
      return;
    }

    setInviteState(InviteState.inProgress);
    try {
      await resendInvite(person.id);
      SuccessToast('Invitation sent');
      setInviteState(InviteState.sent);
    } catch (e) {
      setErrorInfo(e as Error);
      setInviteState(InviteState.error);
      handleErrorToast(e);
    }
  }, [person.id, reinviteState, resendInvite]);

  const handleRemoveUser = async () => {
    try {
      await onRemoveTeamMember(person.id);
    } catch (e) {
      setErrorInfo(e as Error);
    }
  };

  const handleUpdateUser = async (formData: UpdateTeamMemberForm) => {
    try {
      await onUpdateTeamMember(person.id, formData);
    } catch (e) {
      setErrorInfo(e as Error);
    }
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
      <td>{person.role}</td>
      <td className='action'>
        <div className='action-cell'>
          {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
          <div>
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
            <ActionButton onClick={onOpenChangeTeamMemberDialog} icon='pencil' />
            {showTeamMemberDialog && (
              <TeamMemberDialog
                onUpdateTeamMember={handleUpdateUser}
                person={person}
                onOpenChange={onOpenChangeTeamMemberDialog}
              />
            )}

            <ActionButton onClick={onOpenChangeDeleteTeamMemberDialog} icon='trash-can' />
            {showDeleteTeamMemberDialog && (
              <TeamMemberDeleteConfirmationDialog
                onRemoveTeamMember={handleRemoveUser}
                person={person}
                onOpenChange={onOpenChangeDeleteTeamMemberDialog}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default TeamMember;
