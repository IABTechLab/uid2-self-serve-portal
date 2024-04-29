/* eslint-disable camelcase */
import type { Meta } from '@storybook/react';
import { useState } from 'react';

import KeyPairEditDialog from './KeyPairEditDialog';

const meta: Meta<typeof KeyPairEditDialog> = {
  component: KeyPairEditDialog,
  title: 'Key Pairs/Edit Key Pair Dialog',
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
        <KeyPairEditDialog
          onOpenChange={() => setIsOpen(!isOpen)}
          keyPair={{
            name: 'name 1',
            subscriptionId: 'subscription 1',
            siteId: 1234,
            publicKey:
              'UID2-X-L-MFkwEwYHKoZIj0CAQYIKoZIzj0DAQcDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
            created: new Date(),
            createdString: new Date().toLocaleDateString(),
            disabled: false,
          }}
          onEdit={(form) => {
            return Promise.resolve(console.log(`Key pair edited: ${JSON.stringify(form)}`));
          }}
          existingKeyPairs={[]}
        />
      )}
    </div>
  );
};
