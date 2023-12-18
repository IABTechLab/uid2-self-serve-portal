import { ApiKeyDTO } from '../../../api/entities/ApiKey';
import KeyItem from './KeyItem';

import './KeyTable.scss';

type KeyTableProps = {
  apiKeys: ApiKeyDTO[];
};
function KeyTable({ apiKeys }: KeyTableProps) {
  return (
    <div>
      <table className='ApiKeyTable'>
        <thead>
          <tr>
            <th>Name</th>
            <th>keyId</th>
            <th>Roles</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <KeyItem key={key.keyId} apiKey={key} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KeyTable;
