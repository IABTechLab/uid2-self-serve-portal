import clsx from 'clsx';
import log from 'loglevel';
import { useCallback, useContext, useState } from 'react';

import { isUid2Internal } from '../../../api/helpers/internalEmailHelpers';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { ParticipantContext } from '../../contexts/ParticipantProvider';
import { UpdateTeamMemberForm } from '../../services/userAccount';
import { handleErrorToast } from '../../utils/apiError';
import ActionButton from '../Core/Buttons/ActionButton';
import { InlineMessage } from '../Core/InlineMessages/InlineMessage';
import { Label } from '../Core/Labels/Label';
import { LabelRow } from '../Core/Labels/LabelRow';
import { SuccessToast } from '../Core/Popups/Toast';
import { Tooltip } from '../Core/Tooltip/Tooltip';
import TeamMemberDialog from './TeamMemberDialog';
import TeamMemberRemoveConfirmationDialog from './TeamMemberRemoveDialog';

type TeamMemberProps = Readonly<{
  existingTeamMembers: UserWithParticipantRoles[];
  person: UserWithParticipantRoles;
  resendInvite: (id: number, participantId: number) => Promise<void>;
  onRemoveTeamMember: (id: number) => Promise<void>;
  onUpdateTeamMember: (
    id: number,
    form: UpdateTeamMemberForm,
    hasUserFieldsChanged: boolean
  ) => Promise<void>;
  showTeamMemberActions: boolean;
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
  showTeamMemberActions,
}: TeamMemberProps) {
  const [reinviteState, setReinviteState] = useState<InviteState>(InviteState.initial);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState<boolean>();
  const [showTeamMemberRemoveDialog, setShowTeamMemberRemoveDialog] = useState<boolean>();
  const { participant } = useContext(ParticipantContext);
  const isPrimaryContact = participant?.primaryContact?.id === person.id;
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

    setReinviteState(InviteState.inProgress);
    try {
      await resendInvite(person.id, participant!.id);
      SuccessToast('Invitation sent.');
      setReinviteState(InviteState.sent);
    } catch (e) {
      setErrorInfo(e as Error);
      setReinviteState(InviteState.error);
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

  const handleUpdateUser = async (
    formData: UpdateTeamMemberForm,
    hasUserFieldsChanged: boolean
  ) => {
    try {
      await onUpdateTeamMember(person.id, formData, hasUserFieldsChanged);
    } catch (e) {
      setErrorInfo(e as Error);
    }
  };

  const actionButtonDelete = (
    <ActionButton
      onClick={onOpenChangeTeamMemberRemoveDialog}
      icon='trash-can'
      aria-label='Remove Team Member'
      disabled={isPrimaryContact}
    />
  );

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
          {isPrimaryContact && (
            <div className='primary-contact-label'>
              <Label text='Primary Contact' />
            </div>
          )}
        </div>
      </td>
      <td>{person.email}</td>
      <td>{person.jobFunction}</td>
      <td>
        <LabelRow
          labelNames={person.currentParticipantUserRoles?.map((role) => role.roleName) ?? []}
        />
      </td>
      {showTeamMemberActions && (
        <td className='action'>
          <div className='action-cell' data-testid='action-cell'>
            {!!errorMessage && <InlineMessage message={errorMessage} type='Error' />}
            {!person.acceptedTerms && !isUid2Internal(person.email) && (
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
            <ActionButton
              onClick={onOpenChangeTeamMemberDialog}
              icon='pencil'
              aria-label='Edit Team Member'
            />
            {showTeamMemberDialog && (
              <TeamMemberDialog
                teamMembers={existingTeamMembers}
                onUpdateTeamMember={handleUpdateUser}
                person={person}
                onOpenChange={onOpenChangeTeamMemberDialog}
              />
            )}
            {isPrimaryContact ? (
              <Tooltip trigger={actionButtonDelete}>
                One primary contact is required. To delete this team member, first assign another
                team member as the primary contact.
              </Tooltip>
            ) : (
              actionButtonDelete
            )}
            {showTeamMemberRemoveDialog && (
              <TeamMemberRemoveConfirmationDialog
                onRemoveTeamMember={handleRemoveUser}
                person={person}
                onOpenChange={onOpenChangeTeamMemberRemoveDialog}
              />
            )}
          </div>
        </td>
      )}
    </tr>
  );
}

export default TeamMember;
