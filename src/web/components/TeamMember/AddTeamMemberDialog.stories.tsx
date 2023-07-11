import { ComponentMeta, ComponentStory } from '@storybook/react';

import AddTeamMemberDialog from './AddTeamMemberDialog';

export default {
  title: 'Team Member/Add Team Member Dialog',
  component: AddTeamMemberDialog,
} as ComponentMeta<typeof AddTeamMemberDialog>;

const Template: ComponentStory<typeof AddTeamMemberDialog> = (args) => (
  <AddTeamMemberDialog {...args} />
);

export const Default = Template.bind({});
Default.args = {
  addTeamMember: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
  onTeamMemberAdded: () => console.log('team member list updated'),
};
