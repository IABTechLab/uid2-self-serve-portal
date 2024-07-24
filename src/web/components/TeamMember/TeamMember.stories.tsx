import { Meta, StoryObj } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMember from './TeamMember';

const meta: Meta<typeof TeamMember> = {
  title: 'Team Member/Team Member',
  component: TeamMember,
  decorators: [
    (Story) => (
      <div className='portal-team'>
        <table className='portal-team-table'>
          <tbody>
            <Story />
          </tbody>
        </table>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TeamMember>;

export const WithAcceptedTerm: Story = {
  args: {
    person: {
      id: 1,
      email: 'test@user.com',
      firstName: 'test',
      lastName: 'test',
      role: UserRole.DA,
      acceptedTerms: true,
    },
    resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
    onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
    onUpdateTeamMember: (id, formData) =>
      Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
  },
};

export const PendingMember: Story = {
  args: {
    person: {
      id: 2,
      email: 'test@user.com',
      firstName: 'test',
      lastName: 'user 2',
      role: UserRole.Engineering,
      acceptedTerms: false,
    },
    resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
    onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
    onUpdateTeamMember: (id, formData) =>
      Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
  },
};
