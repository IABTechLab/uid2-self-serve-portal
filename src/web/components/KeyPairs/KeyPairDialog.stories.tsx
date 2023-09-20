import { ComponentMeta, ComponentStory } from '@storybook/react';

import KeyPairDialog from './KeyPairDialog';

export default {
  title: 'Key Pairs/Key Pair Dialog',
  component: KeyPairDialog,
} as ComponentMeta<typeof KeyPairDialog>;

const Template: ComponentStory<typeof KeyPairDialog> = (args) => <KeyPairDialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  triggerButton: <button type='button'>Open</button>,
  onAddKeyPair: (form) => Promise.resolve(console.log(`Add new key pair ${JSON.stringify(form)}`)),
};

export const WithKeyPair = Template.bind({});
WithKeyPair.args = {
  ...Default.args,
  keyPair: {
    subscriptionId: 'subscription 1',
    siteId: 1234,
    publicKey: 'public key 1',
    created: new Date(),
    createdString: new Date().toLocaleDateString(),
    disabled: false,
  },
};
