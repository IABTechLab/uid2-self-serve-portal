import { AddKeyPairFormProps } from '../../services/keyPairService';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
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
      <div className='key-pairs-table-header'>
        <div>
          <h2>Key Pairs</h2>
        </div>
        <div className='key-pairs-table-header-right'>
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
      </div>
      <table className='key-pairs-table'>
        <thead>
          <tr>
            <th className='name'>Name</th>
            <th className='subscription-id'>Subscription ID</th>
            <th className='public-key'>Public Key</th>
            <th className='created'>Created</th>
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
      {!keyPairs?.length && (
        <TableNoDataPlaceholder title='No Key Pairs'>
          <span>There are no Key Pairs.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}

export default KeyPairsTable;
