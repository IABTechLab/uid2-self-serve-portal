import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DisplaySecretTable from '../Core/DisplaySecretTable';
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
  return (
    <tr>
      <td className='name'>{keyPair.name}</td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td>
        <DisplaySecretTable secret={{ valueName: 'Public Key', value: keyPair.publicKey }} />
      </td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='action'>
        <div className='action-cell'>
          <KeyPairEditDialog
            keyPair={keyPair}
            existingKeyPairs={existingKeyPairs}
            onEdit={onEdit}
            triggerButton={
              <button type='button' className='icon-button' title='Edit'>
                <FontAwesomeIcon icon='pencil' />
              </button>
            }
          />
          <KeyPairDisableDialog
            keyPair={keyPair}
            onDisable={onDisable}
            triggerButton={
              <button type='button' className='icon-button' title='Delete'>
                <FontAwesomeIcon icon='trash-can' />
              </button>
            }
          />
        </div>
      </td>
    </tr>
  );
}

export default KeyPair;
