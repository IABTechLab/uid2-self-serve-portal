import type { Meta } from '@storybook/react';
import { useState } from 'react';

import KeyPairDialog from './KeyPairDialog';

const meta: Meta<typeof KeyPairDialog> = {
  component: KeyPairDialog,
  title: 'CSTG/Key Pairs/Key Pair Dialog',
};
export default meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyPairDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onSubmitKeyPair={(form) => {
            Promise.resolve(console.log(`Add new key pair ${JSON.stringify(form)}`));
            setIsOpen(!isOpen);
          }}
          existingKeyPairs={[]}
        />
      )}
    </div>
  );
};

export const WithKeyPair = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button className='small-button' type='button' onClick={() => setIsOpen(!isOpen)}>
        Open Dialog
      </button>
      {isOpen && (
        <KeyPairDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          onSubmitKeyPair={(form) => {
            Promise.resolve(console.log(`Add new key pair ${JSON.stringify(form)}`));
            setIsOpen(!isOpen);
          }}
          existingKeyPairs={[]}
          keyPair={{
            subscriptionId: 'subscription 1',
            siteId: 1234,
            publicKey: 'public key 1',
            created: new Date(),
            createdString: new Date().toLocaleDateString(),
            name: 'TESTING',
            disabled: true,
          }}
        />
      )}
    </div>
  );
};
