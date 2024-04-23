/* eslint-disable camelcase */
import type { Meta, StoryObj } from '@storybook/react';

import KeyPairEditDialog from './KeyPairEditDialog';

const meta: Meta<typeof KeyPairEditDialog> = {
  component: KeyPairEditDialog,
  title: 'Key Pairs/Edit Key Pair Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyPairEditDialog>;

export const Default: Story = {
  args: {
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
    onEdit: (form) => {
      console.log(form);
      return Promise.resolve();
    },
  },
};
