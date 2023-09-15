/* eslint-disable camelcase */
import { ComponentMeta, ComponentStory } from '@storybook/react';

// import { UserRole } from '../../../api/entities/User';
import KeyPairsTable from './KeyPairsTable';

export default {
  title: 'Key Pairs/Key Pairs Table',
  component: KeyPairsTable,
} as ComponentMeta<typeof KeyPairsTable>;

const Template: ComponentStory<typeof KeyPairsTable> = (args) => <KeyPairsTable {...args} />;

export const WithoutTeamMembers = Template.bind({});
WithoutTeamMembers.args = {
  keyPairs: [],
  // resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
  // onAddTeamMember: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
  // onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
  // onUpdateTeamMember: (id, formData) =>
  //   Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
};

export const WithTeamMembers = Template.bind({});
WithTeamMembers.args = {
  ...WithoutTeamMembers.args,
  keyPairs: [
    {
      subscriptionId: 'subscription 1',
      siteId: 1234,
      publicKey: 'public key 1',
      createdString: new Date().toLocaleDateString(),
      disabled: false,
    },
    {
      subscriptionId: 'subscription 2',
      siteId: 5678,
      publicKey: 'public key 2',
      createdString: new Date().toLocaleDateString(),
      disabled: false,
    },
  ],
};

// export const WithDeleteError = Template.bind({});
// WithDeleteError.args = {
//   ...WithTeamMembers.args,
//   onRemoveTeamMember: (id) => Promise.reject(console.log(`Failed to remove userId: ${id}`)),
// };
