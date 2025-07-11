import type { Meta, StoryObj } from '@storybook/react-webpack5';

import KeyPairsTable from './KeyPairsTable';

const meta: Meta<typeof KeyPairsTable> = {
  component: KeyPairsTable,
  title: 'CSTG/Key Pairs/Key Pair Table',
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
        name: 'keypair name 1',
        subscriptionId: 'subscription 1',
        siteId: 1234,
        publicKey: '',
        created: new Date(),
        createdString: new Date().toLocaleDateString(),
        disabled: false,
      },
      {
        name: 'keypair name 2',
        subscriptionId: 'subscription 2',
        siteId: 5678,
        publicKey: 'UID2-X-L-MFkwE+Bw==',
        created: new Date(),
        createdString: new Date().toLocaleDateString(),
        disabled: false,
      },
      {
        name: 'keypair name 3',
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
