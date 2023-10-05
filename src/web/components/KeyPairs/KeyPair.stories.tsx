import type { Meta, StoryObj } from '@storybook/react';

import KeyPair from './KeyPair';

const meta: Meta<typeof KeyPair> = {
  component: KeyPair,
  title: 'Key Pairs/Key Pair',
};
export default meta;

type Story = StoryObj<typeof KeyPair>;

const keyPair = {
  name: 'name added in UID2-1925',
  subscriptionId: 'subscription 1',
  siteId: 1234,
  publicKey:
    'UID2-X-L-MFkwEwYHKoZIj0CAQYIKoZIzj0DAQcDQgAEQ6UZYyjvGEg5Cydtmzo/CvTOJc618g8iAOpBtDMO0GE7BZ2IWGwvkG6tdL1QBLXdwnICG+xZpOziF1Z6Cxc+Bw==',
  created: new Date(),
  createdString: new Date().toLocaleDateString(),
  disabled: false,
};

export const Default: Story = {
  args: { keyPair },
  render: (args) => (
    <div className='key-pairs'>
      <table className='key-pairs-table'>
        <tbody>
          <KeyPair {...args} />
        </tbody>
      </table>
    </div>
  ),
};
