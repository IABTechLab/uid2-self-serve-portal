import * as Switch from '@radix-ui/react-switch';

import { UserDTO } from '../../../api/entities/User';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
  onChangeUserLock: (userId: number, isLocked: boolean) => Promise<void>;
}>;

export function UserManagementItem({ user, onChangeUserLock }: UserManagementItemProps) {
  const onLockedToggle = async () => {
    await onChangeUserLock(user.id, !user.locked);
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
    </tr>
  );
}
