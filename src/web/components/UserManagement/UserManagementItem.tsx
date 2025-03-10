import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';

import { AuditTrailDTO } from '../../../api/entities/AuditTrail';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserDTO } from '../../../api/entities/User';
import UserAuditTrailDialog from './UserAuditTrailDialog';
import UserParticipantRolesDialog from './UserParticipantRolesDialog';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
  usersParticipants: ParticipantDTO[];
  userAuditTrail: AuditTrailDTO[];
  onChangeUserLock: (userId: number, isLocked: boolean) => Promise<void>;
}>;

export function UserManagementItem({
  user,
  usersParticipants,
  userAuditTrail,
  onChangeUserLock,
}: UserManagementItemProps) {
  const [showUserParticipantsDialog, setShowUserParticipantsDialog] = useState<boolean>(false);
  const [showUserAuditTrailDialog, setShowUserAuditTrailDialog] = useState<boolean>(false);

  const onLockedToggle = async () => {
    await onChangeUserLock(user.id, !user.locked);
  };

  const onUserParticipantsDialogChange = () => {
    setShowUserParticipantsDialog(!showUserParticipantsDialog);
  };

  const onUserAuditTrailDialogChange = () => {
    setShowUserAuditTrailDialog(!showUserAuditTrailDialog);
  };

  return (
    <tr className='user-management-item'>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.jobFunction}</td>
      <td>{user.acceptedTerms ? 'True' : 'False'}</td>
      <td>
        <button type='button' className='viewable-button' onClick={onUserParticipantsDialogChange}>
          View Participants
        </button>
        {showUserParticipantsDialog && (
          <UserParticipantRolesDialog
            user={user}
            usersParticipants={usersParticipants}
            onOpenChange={onUserParticipantsDialogChange}
          />
        )}

        <button type='button' className='viewable-button' onClick={onUserAuditTrailDialogChange}>
          View Audit Trail
        </button>
        {showUserAuditTrailDialog && (
          <UserAuditTrailDialog
            user={user}
            userAuditTrail={userAuditTrail}
            onOpenChange={onUserAuditTrailDialogChange}
          />
        )}
      </td>
      <td>
        <div className='theme-switch action-cell' title='Disable User Access'>
          <Switch.Root
            name='user-locked'
            checked={user.locked}
            onCheckedChange={onLockedToggle}
            className='theme-toggle clickable-item'
          >
            <Switch.Thumb className='thumb' />
          </Switch.Root>
        </div>
      </td>
    </tr>
  );
}
