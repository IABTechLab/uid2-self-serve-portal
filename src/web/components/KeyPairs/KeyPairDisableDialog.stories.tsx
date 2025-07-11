/* eslint-disable camelcase */

import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';

import KeyPairDisableDialog from './KeyPairDisableDialog';
import { KeyPairModel } from './KeyPairModel';

const meta: Meta<typeof KeyPairDisableDialog> = {
  component: KeyPairDisableDialog,
  title: 'CSTG/Key Pairs/Disable Key Pair Dialog',
};
export default meta;

export const DisableKeyPair = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyPairDisableDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          keyPair={{
            name: 'key pair name 1',
            subscriptionId: 'subscription 1',
            siteId: 1234,
            publicKey:
              'UID2-X-L-MFkwEwYHKoZIj0CAQYIKoZIzj0DAQcDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
            created: new Date(),
            createdString: new Date().toLocaleDateString(),
            disabled: false,
          }}
          onDisable={(keyPair: KeyPairModel) => {
            console.log(`Disabling Key Pair ${keyPair.name}`);
          }}
        />
      )}
    </div>
  );
};
