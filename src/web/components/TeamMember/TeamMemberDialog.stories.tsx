import { ComponentMeta, ComponentStory } from '@storybook/react';

import TeamMemberDialog from './TeamMemberDialog';

export default {
  title: 'Team Member/Team Member Dialog',
  component: TeamMemberDialog,
} as ComponentMeta<typeof TeamMemberDialog>;

const Template: ComponentStory<typeof TeamMemberDialog> = (args) => <TeamMemberDialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  onFormSubmit: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
};
