import KeyPair from './KeyPair';
import { KeyPairModel } from './KeyPairModel';

import './KeyPairsTable.scss';

type KeyPairTableProps = {
  keyPairs: KeyPairModel[] | undefined;
};

function KeyPairsTable({ keyPairs }: KeyPairTableProps) {
  return (
    <div className='key-pairs'>
      <table className='key-pairs-table'>
        <thead>
          <tr>
            <th className='description'>Description</th>
            <th className='subscription-id'>Subscription Id</th>
            <th className='public-key'>Public Key</th>
            <th className='created'>Created</th>
            <th className='disabled'>Disabled</th>
          </tr>
        </thead>
        <tbody>{keyPairs && keyPairs.map((k) => <KeyPair key={k.publicKey} keyPair={k} />)}</tbody>
      </table>
    </div>
  );
}

export default KeyPairsTable;
