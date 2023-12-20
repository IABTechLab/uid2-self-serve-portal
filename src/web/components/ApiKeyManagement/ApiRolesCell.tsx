import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { Tooltip } from '../Core/Tooltip';

import './ApiRolesCell.scss';

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  showRole?: Boolean;
};
function ApiRolesCell({ apiRoles, showRole = false }: ApiRolesProps) {
  return (
    <div className='api-roles-cell'>
      {apiRoles.map((role) => (
        <div key={role.externalName}>
          {showRole ? (
            <Tooltip trigger={role.externalName}>{role.roleName}</Tooltip>
          ) : (
            <div>{role.externalName}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ApiRolesCell;
