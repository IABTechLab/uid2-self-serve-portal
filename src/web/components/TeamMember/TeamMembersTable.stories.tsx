import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMembersTable from './TeamMembersTable';

export default {
  title: 'Team Member/Team Member Table',
  component: TeamMembersTable,
} as ComponentMeta<typeof TeamMembersTable>;

const Template: ComponentStory<typeof TeamMembersTable> = (args) => <TeamMembersTable {...args} />;

export const WithoutTeamMembers = Template.bind({});
WithoutTeamMembers.args = {
  teamMembers: [],
  resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
  addTeamMember: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
  onTeamMembersUpdated: () => console.log('team member list updated'),
};

export const WithTeamMembers = Template.bind({});
WithTeamMembers.args = {
  ...WithoutTeamMembers.args,
  teamMembers: [
    {
      id: 1,
      email: 'test@user.com',
      firstName: 'test',
      lastName: 'test',
      role: UserRole.DA,
      acceptedTerms: true,
      participantId: 1,
    },
    {
      id: 2,
      email: 'test@user.com',
      firstName: 'test',
      lastName: 'user 2',
      role: UserRole.Engineering,
      acceptedTerms: false,
      participantId: 1,
    },
  ],
};
