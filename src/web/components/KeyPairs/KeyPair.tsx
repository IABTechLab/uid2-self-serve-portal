import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import Popover from '../Core/Popover';
import { StatusPopup } from '../Core/StatusPopup';
import { KeyPairModel } from './KeyPairModel';

function PublicKeyPopover(publicKey: string) {
  return (
    <Popover
      triggerButton={
        <button
          className='icon-button expand-button'
          aria-label='expand'
          type='button'
          title='View public key'
        >
          ...
        </button>
      }
    >
      <div>{publicKey}</div>
    </Popover>
  );
}

type KeyPairProps = {
  keyPair: KeyPairModel;
};

function KeyPair({ keyPair }: KeyPairProps) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  const truncatePublicKeyForDisplay = (key: string): string => {
    return key.substring(0, 20);
  };

  const copyPublicKey = (key: string): void => {
    navigator.clipboard.writeText(key);
    setShowStatusPopup(true);
  };

  return (
    <tr>
      <td className='name'>{keyPair.name ?? 'name placeholder until added in UID2-1925'}</td>
      <td className='subscription-id'>{keyPair.subscriptionId}</td>
      <td className='public-key'>
        {truncatePublicKeyForDisplay(keyPair.publicKey)}
        {PublicKeyPopover(keyPair.publicKey)}
        <button
          className='icon-button copy-button'
          aria-label='copy'
          type='button'
          onClick={() => copyPublicKey(keyPair.publicKey)}
          title='Copy public key to clipboard'
        >
          <FontAwesomeIcon icon='copy' />
        </button>
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
