import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { Tooltip } from '../Core/Tooltip';

import './ApiRolesCell.scss';

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  showRole?: Boolean;
};
function ApiRolesCell({ apiRoles, showRole = false }: ApiRolesProps) {
  return (
    <td className='api-roles-cell'>
      {apiRoles.map((role) => (
        <div key={role.externalName}>
          {showRole ? (
            <Tooltip trigger={role.externalName}>{role.roleName}</Tooltip>
          ) : (
            <div>{role.externalName}</div>
          )}
        </div>
      ))}
    </td>
  );
}

export default ApiRolesCell;
