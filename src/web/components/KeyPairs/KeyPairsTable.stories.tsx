import { ComponentMeta, ComponentStory } from '@storybook/react';

import KeyPairsTable from './KeyPairsTable';

export default {
  title: 'Key Pairs/Key Pairs Table',
  component: KeyPairsTable,
} as ComponentMeta<typeof KeyPairsTable>;

const Template: ComponentStory<typeof KeyPairsTable> = (args) => <KeyPairsTable {...args} />;

export const WithoutTeamMembers = Template.bind({});
WithoutTeamMembers.args = {
  keyPairs: [],
};

export const WithTeamMembers = Template.bind({});
WithTeamMembers.args = {
  ...WithoutTeamMembers.args,
  keyPairs: [
    {
      subscriptionId: 'subscription 1',
      siteId: 1234,
      publicKey: 'public key 1',
      created: new Date(),
      createdString: new Date().toLocaleDateString(),
      disabled: false,
    },
    {
      subscriptionId: 'subscription 2',
      siteId: 5678,
      publicKey: 'public key 2',
      created: new Date(),
      createdString: new Date().toLocaleDateString(),
      disabled: false,
    },
  ],
};
