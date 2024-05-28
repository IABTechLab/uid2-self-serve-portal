import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { formatUnixDate } from '../../utils/textHelpers';
import ApiRolesCell from './ApiRolesCell';
import KeyDisableDialog, { OnApiKeyDisable } from './KeyDisableDialog';
import KeyEditDialog, { OnApiKeyEdit } from './KeyEditDialog';
import { shouldRotateApiKey } from './KeyHelper';

import './KeyItem.scss';

type KeyItemProps = Readonly<{
  apiKey: ApiKeyDTO;
  onEdit: OnApiKeyEdit;
  onDisable: OnApiKeyDisable;
  availableRoles: ApiRoleDTO[];
}>;
function KeyItem({ apiKey: apiKeyInitial, onEdit, onDisable, availableRoles }: KeyItemProps) {
  const [apiKey, setApiKey] = useState<ApiKeyDTO>(apiKeyInitial);
  const [showKeyDisableDialog, setShowKeyDisableDialog] = useState<boolean>(false);
  const [showKeyEditDialog, setShowKeyEditDialog] = useState<boolean>(false);
  const [keyShouldRotate, setKeyShouldRotate] = useState<boolean>(false);

  const onOpenChangeKeyDisableDialog = () => {
    setShowKeyDisableDialog(!showKeyDisableDialog);
  };

  const onOpenChangeKeyEditDialog = () => {
    setShowKeyEditDialog(!showKeyEditDialog);
  };

  useEffect(() => {
    setKeyShouldRotate(shouldRotateApiKey(apiKey));
  }, [apiKey]);

  if (apiKey.disabled) {
    return <div />;
  }

  return (
    <tr>
      <td>{apiKey.name}</td>
      <td>{apiKey.key_id}</td>
      <td>
        <ApiRolesCell apiRoles={apiKey.roles} />
      </td>
      <td>{formatUnixDate(apiKey.created)}</td>
      {availableRoles.length > 0 && (
        <td className='action'>
          <div className='action-cell'>
            {keyShouldRotate && (
              <FontAwesomeIcon
                icon='triangle-exclamation'
                title='We recommend you rotate your API key every year.'
                className='warning-button'
              />
            )}
            <button
              type='button'
              className='icon-button'
              title='Edit'
              onClick={onOpenChangeKeyEditDialog}
            >
              <FontAwesomeIcon icon='pencil' />
            </button>
            {showKeyEditDialog && (
              <KeyEditDialog
                apiKey={apiKey}
                onEdit={onEdit}
                availableRoles={availableRoles}
                setApiKey={setApiKey}
                onOpenChange={onOpenChangeKeyEditDialog}
              />
            )}
            <button
              type='button'
              className='icon-button'
              title='Delete'
              onClick={onOpenChangeKeyDisableDialog}
            >
              <FontAwesomeIcon icon='trash-can' />
            </button>
            {showKeyDisableDialog && (
              <KeyDisableDialog
                apiKey={apiKey}
                onDisable={onDisable}
                onOpenChange={onOpenChangeKeyDisableDialog}
              />
            )}
          </div>
        </td>
      )}
    </tr>
  );
}

export default KeyItem;
