import { useState } from 'react';

import DeleteButton from '../Core/DeleteButton';
import DisplaySecretTable from '../Core/DisplaySecretTable';
import EditButton from '../Core/EditButton';
import KeyPairDisableDialog, { OnKeyPairDisable } from './KeyPairDisableDialog';
import KeyPairEditDialog, { OnKeyPairEdit } from './KeyPairEditDialog';
import { KeyPairModel } from './KeyPairModel';

type KeyPairProps = Readonly<{
  keyPair: KeyPairModel;
  existingKeyPairs: KeyPairModel[];
  onEdit: OnKeyPairEdit;
  onDisable: OnKeyPairDisable;
}>;

function KeyPair({ keyPair, existingKeyPairs, onEdit, onDisable }: KeyPairProps) {
  const [showKeyPairDisableDialog, setShowKeyPairDisableDialog] = useState<boolean>(false);
  const [showKeyPairEditDialog, setShowKeyPairEditDialog] = useState<boolean>(false);

  const onOpenChangeKeyPairEditDialog = () => {
    setShowKeyPairEditDialog(!showKeyPairEditDialog);
  };

  const onOpenChangeKeyPairDisableDialog = () => {
    setShowKeyPairDisableDialog(!showKeyPairDisableDialog);
  };

  return (
    <tr>
      <td className='name'>{keyPair.name}</td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td>
        <DisplaySecretTable secret={{ valueName: 'Public key', value: keyPair.publicKey }} />
      </td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='action'>
        <div className='action-cell'>
          <EditButton onClick={onOpenChangeKeyPairEditDialog} />
          {showKeyPairEditDialog && (
            <KeyPairEditDialog
              keyPair={keyPair}
              existingKeyPairs={existingKeyPairs}
              onEdit={onEdit}
              onOpenChange={onOpenChangeKeyPairEditDialog}
            />
          )}

          <DeleteButton onClick={onOpenChangeKeyPairDisableDialog} />
          {showKeyPairDisableDialog && (
            <KeyPairDisableDialog
              keyPair={keyPair}
              onDisable={onDisable}
              onOpenChange={onOpenChangeKeyPairDisableDialog}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default KeyPair;
