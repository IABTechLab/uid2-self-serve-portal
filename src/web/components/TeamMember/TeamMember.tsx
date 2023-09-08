import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useState } from 'react';

import { UpdateTeamMemberForm, UserResponse } from '../../services/userAccount';
import { ApiError } from '../../utils/apiError';
import { Dialog } from '../Core/Dialog';
import { InlineMessage } from '../Core/InlineMessage';
import { StatusNotificationType, StatusPopup } from '../Core/StatusPopup';
import TeamMemberDialog from './TeamMemberDialog';

type DeleteConfirmationDialogProps = {
  person: UserResponse;
  onRemoveTeamMember: () => Promise<void>;
};

function DeleteConfirmationDialog({ person, onRemoveTeamMember }: DeleteConfirmationDialogProps) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleRemove = async () => {
    setOpenConfirmation(false);
    await onRemoveTeamMember();
  };

  return (
    <Dialog
      title='Are you sure you want to delete this team member?'
      triggerButton={
        <button className='icon-button' aria-label='delete' type='button'>
          <FontAwesomeIcon icon='trash-can' />
        </button>
      }
      open={openConfirmation}
      onOpenChange={setOpenConfirmation}
    >
      <ul className='dot-list'>
        <li>
          {person.firstName} {person.lastName}
        </li>
      </ul>
      <div className='dialog-footer-section'>
        <button type='button' className='primary-button' onClick={handleRemove}>
          Delete Team Member
        </button>
        <button
          type='button'
          className='transparent-button'
          onClick={() => setOpenConfirmation(false)}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

type TeamMemberProps = {
  person: UserResponse;
  resendInvite: (id: number) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (id: number, form: UpdateTeamMemberForm) => Promise<void>;
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
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  const onResendInvite = useCallback(async () => {
    if (reinviteState !== InviteState.initial) {
      log.error(`Unexpected click event on reinvite button`);
      return;
    }

    setInviteState(InviteState.inProgress);
    try {
      await resendInvite(person.id);
      setStatusPopup({
        type: 'Success',
        message: `Invitation sent`,
      });
      setShowStatusPopup(true);
      setInviteState(InviteState.sent);
    } catch (e) {
      setErrorInfo(e as Error);
      setInviteState(InviteState.error);
      const err = e as Error;
      const hash = Object.hasOwn(err, 'errorHash') ? `: (${(e as ApiError).errorHash})` : '';
      setStatusPopup({
        type: 'Error',
        message: `${err.message}${hash}`,
      });
      setShowStatusPopup(true);
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
            <TeamMemberDialog
              onUpdateTeamMember={handleUpdateUser}
              person={person}
              triggerButton={
                <button className='icon-button' aria-label='edit' type='button'>
                  <FontAwesomeIcon icon='pencil' />
                </button>
              }
            />
            <DeleteConfirmationDialog onRemoveTeamMember={handleRemoveUser} person={person} />
          </div>
          {statusPopup && (
            <StatusPopup
              status={statusPopup!.type}
              show={showStatusPopup}
              setShow={setShowStatusPopup}
              message={statusPopup!.message}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default TeamMember;
