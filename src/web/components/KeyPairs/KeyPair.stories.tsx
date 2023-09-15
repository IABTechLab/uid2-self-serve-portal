import { ComponentMeta, ComponentStory } from '@storybook/react';

import KeyPair from './KeyPair';

export default {
  title: 'Key Pairs/Key Pair',
  component: KeyPair,
} as ComponentMeta<typeof KeyPair>;

const Template: ComponentStory<typeof KeyPair> = (args) => (
  <div className='portal-team'>
    <table className='portal-team-table'>
      <tbody>
        <KeyPair {...args} />
      </tbody>
    </table>
  </div>
);

export const keyPair = Template.bind({});
keyPair.args = {
  keyPair: {
    subscriptionId: 'subscription 1',
    siteId: 1234,
    publicKey: 'public key 1',
    createdString: new Date().toLocaleDateString(),
    disabled: false,
  },
};
