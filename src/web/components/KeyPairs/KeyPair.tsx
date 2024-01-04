import KeySecretReveal from '../Core/KeySecretReveal';
import { KeyPairModel } from './KeyPairModel';

type KeyPairProps = {
  keyPair: KeyPairModel;
};

function KeyPair({ keyPair }: KeyPairProps) {
  return (
    <tr>
      <td className='name'>{keyPair.name}</td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td className='public-key'>
        <KeySecretReveal title='public-key' value={keyPair.publicKey} />
      </td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='disabled'>{keyPair.disabled.toString()}</td>
    </tr>
  );
}

export default KeyPair;
