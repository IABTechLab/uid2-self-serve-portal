import { Meta, StoryObj } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMemberDialog from './TeamMemberDialog';

export default {
  title: 'Team Member/Team Member Dialog',
  component: TeamMemberDialog,
} as Meta<typeof TeamMemberDialog>;

// const Template: StoryObj<typeof TeamMemberDialog> = (args) => <TeamMemberDialog {...args} />;
type Story = StoryObj<typeof TeamMemberDialog>;

export const Default: Story = {
  args: {
    triggerButton: <button type='button'>Open</button>,
    onAddTeamMember: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
  },
};

export const WithTeamMember: Story = {
  args: {
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
  },
};
