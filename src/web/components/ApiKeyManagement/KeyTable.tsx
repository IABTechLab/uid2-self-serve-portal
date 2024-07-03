import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { SortableTableHeader } from '../Core/Tables/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/Tables/TableNoDataPlaceholder';
import { Tooltip } from '../Core/Tooltip/Tooltip';
import { OnApiKeyDisable } from './KeyDisableDialog';
import { OnApiKeyEdit } from './KeyEditDialog';
import KeyItem from './KeyItem';

import './KeyTable.scss';

function NoKeys() {
  return (
    <TableNoDataPlaceholder
      icon={<img src='/group-icon.svg' alt='group-icon' />}
      title='No API Keys'
    >
      <span>There are no API keys.</span>
    </TableNoDataPlaceholder>
  );
}

type KeyTableProps = Readonly<{
  apiKeys: ApiKeyDTO[];
  onKeyEdit: OnApiKeyEdit;
  onKeyDisable: OnApiKeyDisable;
  availableRoles: ApiRoleDTO[];
}>;

function KeyTableContent({ apiKeys, onKeyEdit, onKeyDisable, availableRoles }: KeyTableProps) {
  const { sortData } = useSortable<ApiKeyDTO>();
  const sortedApiKeys = sortData(apiKeys);

  return (
    <div>
      <table className='api-key-table'>
        <thead>
          <tr>
            <SortableTableHeader<ApiKeyDTO> sortKey='name' header='Name' />
            <th>
              <div className='key-id-header'>
                <div>Key ID</div>
                <Tooltip>
                  Shows the first few characters of your plain text key. If support related to a key
                  is required, please provide this ID.
                </Tooltip>
              </div>
            </th>
            <th>Permissions</th>
            <SortableTableHeader<ApiKeyDTO> sortKey='created' header='Created' />
            {availableRoles.length > 0 && <th className='action'>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedApiKeys.map((key: ApiKeyDTO) => (
            <KeyItem
              key={key.key_id}
              apiKey={key}
              onEdit={onKeyEdit}
              onDisable={onKeyDisable}
              availableRoles={availableRoles}
            />
          ))}
        </tbody>
      </table>
      {apiKeys.length === 0 && <NoKeys />}
    </div>
  );
}

export default function KeyTable(props: KeyTableProps) {
  return (
    <SortableProvider>
      <KeyTableContent {...props} />
    </SortableProvider>
  );
}
