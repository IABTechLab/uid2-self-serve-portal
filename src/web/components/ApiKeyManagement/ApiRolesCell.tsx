import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { sortApiRoles } from '../../utils/apiRoles';
import { Tooltip } from '../Core/Tooltip';

import './ApiRolesCell.scss';

function ApiRoleBox({ apiRole }: { apiRole: ApiRoleDTO }) {
  return <div className='api-role-box'>{apiRole.externalName}</div>;
}

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  showRoleTooltip?: boolean;
};
function ApiRolesCell({ apiRoles, showRoleTooltip = false }: ApiRolesProps) {
  return (
    <div className='api-roles-cell'>
      <div className='api-role-boxes'>
        {sortApiRoles(apiRoles).map((role) => (
          <div key={role.externalName}>
            {showRoleTooltip ? (
              <Tooltip trigger={<ApiRoleBox apiRole={role} />}>{role.roleName}</Tooltip>
            ) : (
              <ApiRoleBox apiRole={role} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiRolesCell;
