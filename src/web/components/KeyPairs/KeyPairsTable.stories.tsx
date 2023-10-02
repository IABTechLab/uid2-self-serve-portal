import type { Meta, StoryObj } from '@storybook/react';

import KeyPairsTable from './KeyPairsTable';

const meta: Meta<typeof KeyPairsTable> = {
  component: KeyPairsTable,
  title: 'Key Pairs/Key Pair Table',
};
export default meta;

type Story = StoryObj<typeof KeyPairsTable>;

export const WithoutKeyPairs: Story = {
  args: {
    keyPairs: [],
  },
};

export const WithKeyPairs: Story = {
  args: {
    ...WithoutKeyPairs.args,
    keyPairs: [
      {
        name: 'name added in UID2-1925',
        subscriptionId: 'subscription 1',
        siteId: 1234,
        publicKey: '',
        created: new Date(),
        createdString: new Date().toLocaleDateString(),
        disabled: false,
      },
      {
        name: 'name added in UID2-1925',
        subscriptionId: 'subscription 2',
        siteId: 5678,
        publicKey: 'UID2-X-L-MFkwE+Bw==',
        created: new Date(),
        createdString: new Date().toLocaleDateString(),
        disabled: false,
      },
      {
        name: 'name added in UID2-1925',
        subscriptionId: 'subscription 3',
        siteId: 5678,
        publicKey:
          'UID2-X-L-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
        created: new Date(),
        createdString: new Date().toLocaleDateString(),
        disabled: false,
      },
    ],
  },
};
