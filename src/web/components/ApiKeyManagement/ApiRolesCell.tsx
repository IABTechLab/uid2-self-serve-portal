import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { Tooltip } from '../Core/Tooltip';

import './ApiRolesCell.scss';

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
};
function ApiRolesCell({ apiRoles }: ApiRolesProps) {
  return (
    <td className='api-roles-cell'>
      {apiRoles.map((role) => (
        <div key={role.externalName}>
          <Tooltip trigger={role.externalName}>{role.roleName}</Tooltip>
        </div>
      ))}
    </td>
  );
}

export default ApiRolesCell;
