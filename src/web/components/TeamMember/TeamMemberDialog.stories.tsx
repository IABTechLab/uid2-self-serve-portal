import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMemberDialog from './TeamMemberDialog';

export default {
  title: 'Team Member/Team Member Dialog',
  component: TeamMemberDialog,
} as ComponentMeta<typeof TeamMemberDialog>;

const Template: ComponentStory<typeof TeamMemberDialog> = (args) => <TeamMemberDialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  triggerButton: <button type='button'>Open</button>,
  onFormSubmit: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
};

export const WithTeamMember = Template.bind({});
WithTeamMember.args = {
  ...Default.args,
  person: {
    id: 1,
    email: 'test@user.com',
    firstName: 'test',
    lastName: 'test',
    role: UserRole.DA,
    acceptedTerms: true,
    participantId: 1,
  },
};
