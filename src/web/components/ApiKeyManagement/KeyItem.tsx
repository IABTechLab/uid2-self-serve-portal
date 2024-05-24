import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { ApiRoleDTO } from '../../../api/entities/ApiRole';
import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import { formatUnixDate } from '../../utils/textHelpers';
import { Tooltip } from '../Core/Tooltip';
import ApiRolesCell from './ApiRolesCell';
import KeyDisableDialog, { OnApiKeyDisable } from './KeyDisableDialog';
import KeyEditDialog, { OnApiKeyEdit } from './KeyEditDialog';

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
  const [keyNeedsRotating, setKeyNeedsRotating] = useState<boolean>(false);

  const onOpenChangeKeyDisableDialog = () => {
    setShowKeyDisableDialog(!showKeyDisableDialog);
  };

  const onOpenChangeKeyEditDialog = () => {
    setShowKeyEditDialog(!showKeyEditDialog);
  };

  useEffect(() => {
    const currentDate = new Date().getTime();
    const currentDateFormat = Math.floor(currentDate / 1000);
    console.log(formatUnixDate(apiKey.created));
    console.log(currentDateFormat);
    console.log(apiKey.created);
    console.log(currentDateFormat - apiKey.created);
    if (currentDateFormat - apiKey.created > 2629800) {
      console.log('in if statement');
      setKeyNeedsRotating(true);
    }
  }, [apiKey]);

  // console.log('date:');
  // console.log(apiKey.created);
  // console.log(formatUnixDate(apiKey.created));
  // const currentDate = new Date().getTime();
  // const seconds = Math.floor(currentDate / 1000);
  // console.log(seconds);

  // const newDate = currentDate.toDateString();
  // console.log(newDate);
  // console.log(currentDate.getTime());
  // console.log(Date.parse(newDate));
  // console.log(formatUnixDate(currentDate.getTime()));

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
            {keyNeedsRotating && (
              <FontAwesomeIcon
                icon='triangle-exclamation'
                title='Rotate API Key'
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
