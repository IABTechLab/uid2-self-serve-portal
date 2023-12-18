import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import KeyItem from './KeyItem';

import './KeyTable.scss';

function NoKeys() {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/group-icon.svg' alt='group-icon' />}
      title='No API Keys'
    >
      <span>There are no API keys. Go create one!</span>
    </TableNoDataPlaceholder>
  );
}

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
            <KeyItem key={key.key_id} apiKey={key} />
          ))}
        </tbody>
      </table>
      {apiKeys.length === 0 && <NoKeys />}
    </div>
  );
}

export default KeyTable;
