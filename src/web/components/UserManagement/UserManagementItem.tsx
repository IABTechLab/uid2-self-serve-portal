import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';

import { UserDTO } from '../../../api/entities/User';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
  onChangeUserLock: (userId: number, isLocked: boolean) => Promise<void>;
}>;

export function UserManagementItem({ user, onChangeUserLock }: UserManagementItemProps) {
  const [lockedState, setLockedState] = useState(user.locked);

  const onLockedToggle = async () => {
    await onChangeUserLock(user.id, !lockedState);
    setLockedState(!lockedState);
  };

  return (
    <tr className='user-management-item'>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.jobFunction}</td>
      <td>{user.acceptedTerms ? 'True' : 'False'}</td>
      <td>
        <div className='theme-switch'>
          <Switch.Root
            name='dark-mode'
            checked={lockedState}
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
