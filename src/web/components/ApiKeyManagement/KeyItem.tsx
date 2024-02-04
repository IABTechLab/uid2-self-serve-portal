import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { formatUnixDate } from '../../utils/textHelpers';
import ApiRolesCell from './ApiRolesCell';
import KeyDisableDialog, { OnApiKeyDisable } from './KeyDisableDialog';
import KeyEditDialog, { OnApiKeyEdit } from './KeyEditDialog';

import './KeyItem.scss';

type KeyItemProps = {
  apiKey: ApiKeyDTO;
  onEdit: OnApiKeyEdit;
  onDisable: OnApiKeyDisable;
  availableRoles: ApiRoleDTO[];
};
function KeyItem({ apiKey: apiKeyInitial, onEdit, onDisable, availableRoles }: KeyItemProps) {
  const [apiKey, setApiKey] = useState<ApiKeyDTO>(apiKeyInitial);

  if (apiKey.disabled) {
    return <div />;
  }

  return (
    <tr className='key-item'>
      <td>{apiKey.name}</td>
      <td>{apiKey.key_id}</td>
      <td>
        <ApiRolesCell apiRoles={apiKey.roles} availableRoles={availableRoles} />
      </td>
      <td>{formatUnixDate(apiKey.created)}</td>
      {availableRoles.length > 0 && (
        <td className='key-actions'>
          <KeyEditDialog
            apiKey={apiKey}
            onEdit={onEdit}
            triggerButton={
              <button type='button' className='transparent-button'>
                <FontAwesomeIcon icon='pencil' />
              </button>
            }
            availableRoles={availableRoles}
            setApiKey={setApiKey}
          />
          <KeyDisableDialog
            apiKey={apiKey}
            onDisable={onDisable}
            triggerButton={
              <button type='button' className='transparent-button'>
                <FontAwesomeIcon icon='trash-can' />
              </button>
            }
          />
        </td>
      )}
    </tr>
  );
}

export default KeyItem;
