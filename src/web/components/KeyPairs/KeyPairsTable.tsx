import { useState } from 'react';

import { SortableProvider, useSortable } from '../../contexts/SortableTableProvider';
import { AddKeyPairFormProps } from '../../services/keyPairService';
import { SortableTableHeader } from '../Core/SortableTableHeader';
import { TableNoDataPlaceholder } from '../Core/TableNoDataPlaceholder';
import KeyPair from './KeyPair';
import KeyPairDialog from './KeyPairDialog';
import { OnKeyPairDisable } from './KeyPairDisableDialog';
import { OnKeyPairEdit } from './KeyPairEditDialog';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairsTable.scss';

type KeyPairTableProps = Readonly<{
  keyPairs: KeyPairModel[];
  onAddKeyPair: (form: AddKeyPairFormProps) => Promise<void>;
  onKeyPairEdit: OnKeyPairEdit;
  onKeyPairDisable: OnKeyPairDisable;
}>;

function KeyPairsTableContent({
  keyPairs,
  onAddKeyPair,
  onKeyPairEdit,
  onKeyPairDisable,
}: KeyPairTableProps) {
  const [showKeyPairDialog, setShowKeyPairDialog] = useState(false);

  const onOpenChangeKeyPairDialog = () => {
    setShowKeyPairDialog(!showKeyPairDialog);
  };

  const onSubmitKeyPair = async (formData: AddKeyPairFormProps) => {
    await onAddKeyPair(formData);
    setShowKeyPairDialog(false);
  };

  const { sortData } = useSortable<KeyPairModel>();
  const sortedKeyPairs = sortData(keyPairs);

  return (
    <div className='key-pairs'>
      <div className='key-pairs-table-header'>
        <div>
          <h2>Key Pairs</h2>
        </div>

        <div className='key-pairs-table-header-right'>
          <div className='add-key-pair'>
            <button className='small-button' type='button' onClick={onOpenChangeKeyPairDialog}>
              Add Key Pair
            </button>
            {showKeyPairDialog && (
              <KeyPairDialog
                existingKeyPairs={keyPairs}
                onSubmitKeyPair={onSubmitKeyPair}
                onOpenChange={onOpenChangeKeyPairDialog}
              />
            )}
          </div>
        </div>
      </div>
      <table className='key-pairs-table'>
        <thead>
          <tr>
            <SortableTableHeader<KeyPairModel> className='name' sortKey='name' header='Name' />
            <SortableTableHeader<KeyPairModel>
              className='subscription-id'
              sortKey='subscriptionId'
              header='Subscription ID'
            />
            <th className='public-key'>Public Key</th>
            <SortableTableHeader<KeyPairModel>
              className='created'
              sortKey='created'
              header='Created'
            />
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedKeyPairs.map((k) => (
            <KeyPair
              key={k.publicKey}
              keyPair={k}
              existingKeyPairs={sortedKeyPairs}
              onEdit={onKeyPairEdit}
              onDisable={onKeyPairDisable}
            />
          ))}
        </tbody>
      </table>
      {!keyPairs?.length && (
        <TableNoDataPlaceholder title='No Key Pairs'>
          <span>There are no key pairs.</span>
        </TableNoDataPlaceholder>
      )}
    </div>
  );
}

export default function KeyPairsTable(props: KeyPairTableProps) {
  return (
    <SortableProvider>
      <KeyPairsTableContent {...props} />
    </SortableProvider>
  );
}
