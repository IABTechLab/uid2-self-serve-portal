import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { sortApiRoles } from '../../utils/apiRoles';
import { Label } from '../Core/Labels/Label';
import { Tooltip } from '../Core/Tooltip/Tooltip';

import './ApiRolesCell.scss';

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  showRoleTooltip?: boolean;
};
function ApiRolesCell({ apiRoles, showRoleTooltip = false }: ApiRolesProps) {
  return (
    <div className='api-roles-cell'>
      <div className='label-row'>
        {sortApiRoles(apiRoles).map((role) => (
          <div key={role.externalName}>
            {showRoleTooltip ? (
              <Tooltip trigger={<Label text={role.externalName} />}>{role.roleName}</Tooltip>
            ) : (
              <Label text={role.externalName} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiRolesCell;
