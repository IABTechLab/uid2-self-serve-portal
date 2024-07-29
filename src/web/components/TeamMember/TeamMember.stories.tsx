import { Meta, StoryObj } from '@storybook/react';

import { JobFunction } from '../../../api/entities/User';
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
      jobFunction: JobFunction.DA,
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
      jobFunction: JobFunction.Engineering,
      acceptedTerms: false,
    },
    resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
    onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
    onUpdateTeamMember: (id, formData) =>
      Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
  },
};
