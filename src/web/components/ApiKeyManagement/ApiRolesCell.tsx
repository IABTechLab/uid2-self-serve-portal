import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { sortApiRoles } from '../../utils/apiRoles';
import { Label } from '../Core/Labels/Label';
import { Tooltip } from '../Core/Tooltip/Tooltip';

import './ApiRolesCell.scss';
import '../Core/Labels/LabelRow.scss';

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  showRoleTooltip?: boolean;
};
function ApiRolesCell({ apiRoles, showRoleTooltip = false }: ApiRolesProps) {
  const sortedApiRoles = sortApiRoles(apiRoles);

  return (
    <div className='api-roles-cell'>
      <div className='label-row'>
        {sortedApiRoles.map((apiRole) => (
          <div key={apiRole.externalName}>
            {showRoleTooltip ? (
              <Tooltip trigger={<Label text={apiRole.externalName} />}>{apiRole.roleName}</Tooltip>
            ) : (
              <Label text={apiRole.externalName} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiRolesCell;
