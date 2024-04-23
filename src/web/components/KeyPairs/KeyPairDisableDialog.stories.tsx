/* eslint-disable camelcase */

import type { Meta, StoryObj } from '@storybook/react';

import KeyPairDisableDialog from './KeyPairDisableDialog';
import { KeyPairModel } from './KeyPairModel';

const meta: Meta<typeof KeyPairDisableDialog> = {
  component: KeyPairDisableDialog,
  title: 'Key Pairs/Disable Key Pair Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyPairDisableDialog>;

export const DisableApiKey: Story = {
  args: {
    onDisable: (keyPair: KeyPairModel) => {
      console.log(`Disabling Key ${keyPair.name}`);
    },
    keyPair: {
      name: 'name 1',
      subscriptionId: 'subscription 1',
      siteId: 1234,
      publicKey:
        'UID2-X-L-MFkwEwYHKoZIj0CAQYIKoZIzj0DAQcDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
      created: new Date(),
      createdString: new Date().toLocaleDateString(),
      disabled: false,
    },
  },
};
