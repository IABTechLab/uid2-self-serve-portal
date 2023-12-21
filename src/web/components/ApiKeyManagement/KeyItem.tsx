import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import ApiRolesCell from './ApiRolesCell';

const SecondToMillisecond = 1000;

function formatDate(timeValue: number) {
  const date = new Date(timeValue * SecondToMillisecond);
  return date.toLocaleDateString();
}

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
      <td>{formatDate(apiKey.created)}</td>
    </tr>
  );
}

export default KeyItem;
