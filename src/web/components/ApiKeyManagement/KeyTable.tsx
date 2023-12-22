import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import { Tooltip } from '../Core/Tooltip';
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
      <table className='api-key-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th className='key-id-header'>
              <div>Key ID</div>
              <Tooltip>
                Shows the first few characters of your plain text key. If support related to a key
                is required, please provide this ID.
              </Tooltip>
            </th>
            <th>Roles</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key: ApiKeyDTO) => (
            <KeyItem key={key.key_id} apiKey={key} />
          ))}
        </tbody>
      </table>
      {apiKeys.length === 0 && <NoKeys />}
    </div>
  );
}

export default KeyTable;
