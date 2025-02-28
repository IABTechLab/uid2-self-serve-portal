import { UserDTO } from '../../../api/entities/User';

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
