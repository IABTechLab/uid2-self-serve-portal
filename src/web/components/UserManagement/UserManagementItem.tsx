import { useState } from 'react';

import { UserDTO } from '../../../api/entities/User';
import ActionButton from '../Core/Buttons/ActionButton';
import { LabelRow } from '../Core/Labels/LabelRow';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
}>;

export function UserManagementItem({ user }: UserManagementItemProps) {
  return (
    <tr className='user-management-item'>
      <td>{user.lastName}</td>
    </tr>
  );
}
