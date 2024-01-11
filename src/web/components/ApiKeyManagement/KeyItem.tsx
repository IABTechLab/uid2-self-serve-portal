import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { EditApiKeyFormDTO } from '../../services/apiKeyService';
import { formatUnixDate } from '../../utils/textHelpers';
import ApiRolesCell from './ApiRolesCell';
import KeyEditDialog from './KeyEditDialog';

type KeyItemProps = {
  apiKey: ApiKeyDTO;
  onEdit: (form: EditApiKeyFormDTO) => Promise<void>;
  availableRoles: ApiRoleDTO[];
};
function KeyItem({ apiKey, onEdit, availableRoles }: KeyItemProps) {
  return (
    <tr>
      <td>{apiKey.name}</td>
      <td>{apiKey.key_id}</td>
      <td>
        <ApiRolesCell apiRoles={apiKey.roles} />
      </td>
      <td>{formatUnixDate(apiKey.created)}</td>
      <td>
        <KeyEditDialog
          apiKey={apiKey}
          onEdit={onEdit}
          triggerButton={
            <button type='button' className='transparent-button'>
              <FontAwesomeIcon icon='pencil' />
            </button>
          }
          availableRoles={availableRoles}
        />
      </td>
    </tr>
  );
}

export default KeyItem;
