import { Meta } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMembersTable from './TeamMembersTable';

export default {
  title: 'Team Member/Team Member Table',
  component: TeamMembersTable,
} as Meta<typeof TeamMembersTable>;

export const WithoutTeamMembers = {
  args: {
    teamMembers: [],
    resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
    onAddTeamMember: (form) => Promise.resolve(console.log(`Add new user ${JSON.stringify(form)}`)),
    onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
    onUpdateTeamMember: (id, formData) =>
      Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
  },
};

export const WithTeamMembers = {
  args: {
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
  },
};

export const WithDeleteError = {
  args: {
    ...WithTeamMembers.args,
    onRemoveTeamMember: (id) => Promise.reject(console.log(`Failed to remove userId: ${id}`)),
  },
};
