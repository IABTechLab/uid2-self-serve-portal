import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useContext, useState } from 'react';

import { UserDTO } from '../../../api/entities/User';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { UpdateTeamMemberForm, UserResponse } from '../../services/userAccount';
import { handleErrorToast } from '../../utils/apiError';
import ActionButton from '../Core/Buttons/ActionButton';
import { InlineMessage } from '../Core/InlineMessages/InlineMessage';
import { Label } from '../Core/Labels/Label';
import { LabelRow } from '../Core/Labels/LabelRow';
import { SuccessToast } from '../Core/Popups/Toast';
import TeamMemberDialog from './TeamMemberDialog';
import TeamMemberRemoveConfirmationDialog from './TeamMemberRemoveDialog';

type TeamMemberProps = Readonly<{
  existingTeamMembers: UserDTO[];
  person: UserResponse;
  resendInvite: (id: number, participantId: number) => Promise<void>;
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
  existingTeamMembers,
  person,
  resendInvite,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: TeamMemberProps) {
  const [reinviteState, setInviteState] = useState<InviteState>(InviteState.initial);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>();
  const [showTeamMemberRemoveDialog, setShowTeamMemberRemoveDialog] = useState<boolean>();
  const { participant } = useContext(ParticipantContext);
  const setErrorInfo = (e: Error) => {
    setErrorMessage(e.message);
  };

  const onOpenChangeTeamMemberDialog = () => {
    setShowTeamMemberDialog(!showTeamMemberDialog);
  };

  const onOpenChangeTeamMemberRemoveDialog = () => {
    setShowTeamMemberRemoveDialog(!showTeamMemberRemoveDialog);
  };

  const onResendInvite = useCallback(async () => {
    if (reinviteState !== InviteState.initial) {
      log.error(`Unexpected click event on reinvite button`);
      return;
    }

    setInviteState(InviteState.inProgress);
    try {
      await resendInvite(person.id, participant!.id);
      SuccessToast('Invitation sent.');
      setInviteState(InviteState.sent);
    } catch (e) {
      setErrorInfo(e as Error);
      setInviteState(InviteState.error);
      handleErrorToast(e);
    }
  }, [participant, person.id, reinviteState, resendInvite]);

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
          {person.acceptedTerms || (
            <div className='pending-label'>
              <Label text='Pending' />
            </div>
          )}
        </div>
      </td>
      <td>{person.email}</td>
      <td>{person.jobFunction}</td>
      <td>
        <LabelRow labelNames={person.currentParticipantUserRoleNames ?? []} />
      </td>
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
                teamMembers={existingTeamMembers}
                onUpdateTeamMember={handleUpdateUser}
                person={person}
                onOpenChange={onOpenChangeTeamMemberDialog}
              />
            )}

            <ActionButton onClick={onOpenChangeTeamMemberRemoveDialog} icon='trash-can' />
            {showTeamMemberRemoveDialog && (
              <TeamMemberRemoveConfirmationDialog
                onRemoveTeamMember={handleRemoveUser}
                person={person}
                onOpenChange={onOpenChangeTeamMemberRemoveDialog}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default TeamMember;
