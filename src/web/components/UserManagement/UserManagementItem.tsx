import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';

import { UserDTO } from '../../../api/entities/User';
import ActionButton from '../Core/Buttons/ActionButton';
import UserAuditTrailDialog from './UserAuditTrailDialog';
import UserParticipantRolesDialog from './UserParticipantRolesDialog';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
  onChangeUserLock: (userId: number, isLocked: boolean) => Promise<void>;
}>;

export function UserManagementItem({ user, onChangeUserLock }: UserManagementItemProps) {
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
      <td className='action'>
        <div className='action-cell'>
          <ActionButton onClick={onUserParticipantsDialogChange} icon='pencil' />
          {showUserParticipantsDialog && (
            <UserParticipantRolesDialog user={user} onOpenChange={onUserParticipantsDialogChange} />
          )}

          <ActionButton onClick={onUserAuditTrailDialogChange} icon='trash-can' />
          {showUserAuditTrailDialog && (
            <UserAuditTrailDialog user={user} onOpenChange={onUserAuditTrailDialogChange} />
          )}
        </div>
      </td>
    </tr>
  );
}
