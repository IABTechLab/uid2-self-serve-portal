import { ComponentMeta, ComponentStory } from '@storybook/react';

import KeyPair from './KeyPair';

export default {
  title: 'Key Pairs/Key Pair',
  component: KeyPair,
} as ComponentMeta<typeof KeyPair>;

const Template: ComponentStory<typeof KeyPair> = (args) => (
  <div className='key-pairs'>
    <table className='key-pairs-table'>
      <tbody>
        <KeyPair {...args} />
      </tbody>
    </table>
  </div>
);

export const KeyPairTemplate = Template.bind({});
KeyPairTemplate.args = {
  keyPair: {
    subscriptionId: 'subscription 1',
    siteId: 1234,
    publicKey: 'public key 1',
    created: new Date(),
    createdString: new Date().toLocaleDateString(),
    disabled: false,
  },
};
