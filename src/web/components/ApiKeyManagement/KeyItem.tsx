import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import ApiRolesCell from './ApiRolesCell';

import './KeyItem.scss';

function formatDate(timeValue: number) {
  const date = new Date(timeValue * 1000);
  return date.toLocaleDateString();
}

type KeyItemProps = {
  apiKey: ApiKeyDTO;
};
function KeyItem({ apiKey }: KeyItemProps) {
  return (
    <tr className='api-key-item'>
      <td>{apiKey.name}</td>
      <td>{apiKey.key_id}</td>
      <td>
        <ApiRolesCell apiRoles={apiKey.roles} />
      </td>
      <td>{formatDate(apiKey.created)}</td>
    </tr>
  );
}

export default KeyItem;
