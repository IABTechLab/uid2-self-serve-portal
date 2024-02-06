import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { sortApiRoles } from '../../utils/apiRoles';
import { Tooltip } from '../Core/Tooltip';

import './ApiRolesCell.scss';

function ApiRoleBox({ apiRole, valid }: { apiRole: ApiRoleDTO; valid: boolean }) {
  return (
    <div className='api-role-box'>
      {apiRole.externalName}
      {!valid && (
        <Tooltip>
          You do not have permission for this role. You will not be able to create new Keys with
          this Role. This does not affect this Key.
        </Tooltip>
      )}
    </div>
  );
}

type ApiRolesProps = {
  apiRoles: ApiRoleDTO[];
  availableRoles?: ApiRoleDTO[];
  showRoleTooltip?: boolean;
};
function ApiRolesCell({ apiRoles, availableRoles, showRoleTooltip = false }: ApiRolesProps) {
  let availableRolesId: number[] = [];

  if (availableRoles) {
    availableRolesId = availableRoles.map((role) => role.id);
  } else {
    availableRolesId = apiRoles.map((role) => role.id);
  }

  return (
    <div className='api-roles-cell'>
      <div className='api-role-boxes'>
        {sortApiRoles(apiRoles).map((role) => (
          <div key={role.externalName}>
            {showRoleTooltip ? (
              <Tooltip
                trigger={<ApiRoleBox apiRole={role} valid={availableRolesId.includes(role.id)} />}
              >
                {role.roleName}
              </Tooltip>
            ) : (
              <ApiRoleBox apiRole={role} valid={availableRolesId.includes(role.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiRolesCell;
