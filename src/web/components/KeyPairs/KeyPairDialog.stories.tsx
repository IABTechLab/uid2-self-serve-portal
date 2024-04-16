import type { Meta, StoryObj } from '@storybook/react';

import KeyPairDialog from './KeyPairDialog';

const meta: Meta<typeof KeyPairDialog> = {
  component: KeyPairDialog,
  title: 'Key Pairs/Key Pair Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyPairDialog>;

export const Default: Story = {
  args: {
    // triggerButton: <button type='button'>Open</button>,
    onSubmitKeyPair: (form) =>
      Promise.resolve(console.log(`Add new key pair ${JSON.stringify(form)}`)),
  },
};

export const WithKeyPair: Story = {
  args: {
    ...Default.args,
    keyPair: {
      subscriptionId: 'subscription 1',
      siteId: 1234,
      publicKey: 'public key 1',
      created: new Date(),
      createdString: new Date().toLocaleDateString(),
      name: 'TESTING',
      disabled: true,
    },
  },
};
