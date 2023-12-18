import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import ApiRolesCell from './ApiRolesCell';

import './KeyItem.scss';

function formatDate(timeValue: number) {
  const date = new Date(timeValue * 1000);

  const twoDigit = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const year = date.getFullYear();
  const month = twoDigit(date.getMonth() + 1);
  const day = twoDigit(date.getDate());

  return `${day}/${month}/${year}`;
}

type KeyItemProps = {
  apiKey: ApiKeyDTO;
};
function KeyItem({ apiKey }: KeyItemProps) {
  return (
    <tr className='ApiKeyItem'>
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
