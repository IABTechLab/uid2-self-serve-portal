import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { formatUnixDate } from '../../utils/textHelpers';
import ApiRolesCell from './ApiRolesCell';

type KeyItemProps = {
  apiKey: ApiKeyDTO;
};
function KeyItem({ apiKey }: KeyItemProps) {
  return (
    <tr>
      <td>{apiKey.name}</td>
      <td>{apiKey.key_id}</td>
      <td>
        <ApiRolesCell apiRoles={apiKey.roles} />
      </td>
      <td>{formatUnixDate(apiKey.created)}</td>
    </tr>
  );
}

export default KeyItem;
