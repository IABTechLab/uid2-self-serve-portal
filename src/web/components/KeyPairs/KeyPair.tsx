import { ReactNode, useState } from 'react';

import Popover from '../Core/Popover';
import { StatusPopup } from '../Core/StatusPopup';
import { KeyPairModel } from './KeyPairModel';

type KeyPairProps = {
  keyPair: KeyPairModel;
};

function KeyPair({ keyPair }: KeyPairProps) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  const getPublicKeyDisplay = (key: string): string => {
    const display =
      key.length > 20
        ? `${key.substring(0, 10)}......${key.substring(key.length - 10, key.length)}`
        : key;
    return display;
  };

  const getPublicKeyViewButton = (key: string): ReactNode => {
    const node =
      key.length > 20 ? (
        <>
          <Popover
            triggerButton={
              <button
                className='icon-button expand-button'
                aria-label='view key'
                type='button'
                title='View public key'
              >
                View
              </button>
            }
          >
            <div>{key}</div>
          </Popover>
          |
        </>
      ) : (
        key
      );

    return node;
  };

  const copyPublicKey = (key: string): void => {
    navigator.clipboard.writeText(key);
    setShowStatusPopup(true);
  };

  return (
    <tr>
      <td className='name'>{keyPair.name}</td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td className='public-key'>
        {getPublicKeyDisplay(keyPair.publicKey)}
        {getPublicKeyViewButton(keyPair.publicKey)}
        {keyPair.publicKey.length > 0 && (
          <button
            className='icon-button copy-button'
            aria-label='copy'
            type='button'
            onClick={() => copyPublicKey(keyPair.publicKey)}
            title='Copy public key to clipboard'
          >
            Copy
          </button>
        )}
        {showStatusPopup && (
          <StatusPopup
            status='Success'
            show={showStatusPopup}
            setShow={setShowStatusPopup}
            message='Public key copied to clipboard.'
          />
        )}
      </td>
      <td className='created'>{keyPair.createdString}</td>
      <td className='disabled'>{keyPair.disabled.toString()}</td>
    </tr>
  );
}

export default KeyPair;
