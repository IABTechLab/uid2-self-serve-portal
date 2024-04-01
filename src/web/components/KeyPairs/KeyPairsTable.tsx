import { AddKeyPairFormProps } from '../../services/keyPairService';
import KeyPair from './KeyPair';
import KeyPairDialog from './KeyPairDialog';
import { OnKeyPairDisable } from './KeyPairDisableDialog';
import { OnKeyPairEdit } from './KeyPairEditDialog';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairsTable.scss';

type KeyPairTableProps = Readonly<{
  keyPairs: KeyPairModel[] | undefined;
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  onKeyPairEdit: OnKeyPairEdit;
  onKeyPairDisable: OnKeyPairDisable;
}>;

function KeyPairsTable({
  keyPairs,
  onAddKeyPair,
  onKeyPairEdit,
  onKeyPairDisable,
}: KeyPairTableProps) {
  return (
    <div className='key-pairs'>
      <table className='key-pairs-table'>
        <thead>
          <tr>
            <th className='name'>Name</th>
            <th className='subscription-id'>Subscription Id</th>
            <th className='public-key'>Public Key</th>
            <th className='created'>Created</th>
            <th className='disabled'>Disabled</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keyPairs &&
            keyPairs.map((k) => (
              <KeyPair
                key={k.publicKey}
                keyPair={k}
                onEdit={onKeyPairEdit}
                onDisable={onKeyPairDisable}
              />
            ))}
        </tbody>
      </table>
      <div className='add-key-pair'>
        <KeyPairDialog
          onAddKeyPair={onAddKeyPair}
          triggerButton={
            <button className='small-button' type='button'>
              Add Key Pair
            </button>
          }
        />
      </div>
    </div>
  );
}

export default KeyPairsTable;
