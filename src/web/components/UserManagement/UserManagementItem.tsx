import { UserDTO } from '../../../api/entities/User';

import './UserManagementItem.scss';

type UserManagementItemProps = Readonly<{
  user: UserDTO;
}>;

export function UserManagementItem({ user }: UserManagementItemProps) {
  return (
    <tr className='user-management-item'>
      <td>{user.email}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.jobFunction}</td>
      <td>{user.acceptedTerms}</td>
      <td />
      <td />
    </tr>
  );
}
