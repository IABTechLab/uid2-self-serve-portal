import { KeyPairModel } from './KeyPairModel';

type KeyPairProps = {
  keyPair: KeyPairModel;
};

function KeyPair({ keyPair }: KeyPairProps) {
  return (
    <tr>
      <td className='description'>
        {keyPair.description ?? 'description placeholder until added in UID2-1925'}
      </td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td className='public-key'>{keyPair.publicKey}</td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='disabled'>{keyPair.disabled.toString()}</td>
    </tr>
  );
}

export default KeyPair;
