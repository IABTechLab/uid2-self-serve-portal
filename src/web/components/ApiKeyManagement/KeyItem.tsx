import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { formatUnixDate } from '../../utils/textHelpers';
import ActionButton, { ActionButtonIcon } from '../Core/ActionButton';
import { Tooltip } from '../Core/Tooltip';
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
  const [showRotateKeyWarning, setShowRotateKeyWarning] = useState<boolean>(false);

  const onOpenChangeKeyDisableDialog = () => {
    setShowKeyDisableDialog(!showKeyDisableDialog);
  };

  const onOpenChangeKeyEditDialog = () => {
    setShowKeyEditDialog(!showKeyEditDialog);
  };

  useEffect(() => {
    setShowRotateKeyWarning(shouldRotateApiKey(apiKey));
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
            {showRotateKeyWarning && (
              <Tooltip
                trigger={<FontAwesomeIcon icon='triangle-exclamation' className='warning-icon' />}
              >
                We recommend rotating API keys every year.
              </Tooltip>
            )}
            <ActionButton
              onClick={onOpenChangeKeyEditDialog}
              icon={ActionButtonIcon.edit}
              className='action-button'
            />

            {showKeyEditDialog && (
              <KeyEditDialog
                apiKey={apiKey}
                onEdit={onEdit}
                availableRoles={availableRoles}
                setApiKey={setApiKey}
                onOpenChange={onOpenChangeKeyEditDialog}
              />
            )}

            <ActionButton
              onClick={onOpenChangeKeyDisableDialog}
              icon={ActionButtonIcon.delete}
              className='action-button'
            />
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
