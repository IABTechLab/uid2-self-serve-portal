import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserRole } from '../../../api/entities/User';
import TeamMember from './TeamMember';

export default {
  title: 'Team Member/Team Member',
  component: TeamMember,
} as ComponentMeta<typeof TeamMember>;

const Template: ComponentStory<typeof TeamMember> = (args) => (
  <div className='portal-team'>
    <table className='portal-team-table'>
      <tbody>
        <TeamMember {...args} />
      </tbody>
    </table>
  </div>
);

export const WithAcceptedTerm = Template.bind({});
WithAcceptedTerm.args = {
  person: {
    id: 1,
    email: 'test@user.com',
    firstName: 'test',
    lastName: 'test',
    role: UserRole.DA,
    acceptedTerms: true,
    participantId: 1,
  },
  resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
  onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
  onUpdateTeamMember: (id, formData) =>
    Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
};

export const PendingMember = Template.bind({});
PendingMember.args = {
  person: {
    id: 2,
    email: 'test@user.com',
    firstName: 'test',
    lastName: 'user 2',
    role: UserRole.Engineering,
    acceptedTerms: false,
    participantId: 1,
  },
  resendInvite: (id) => Promise.resolve(console.log(`Resend invite to userId: ${id}`)),
  onRemoveTeamMember: (id) => Promise.resolve(console.log(`Remove userId: ${id}`)),
  onUpdateTeamMember: (id, formData) =>
    Promise.resolve(console.log(`Update userId: ${id} with ${JSON.stringify(formData)}`)),
};
