import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import { ParticipantRequestDTO } from '../../../api/routers/participantsRouter';
import { ParticipantRequestsTable } from './ParticipantRequestsTable';

export default {
  title: 'Manage Participants/ParticipantRequestsTable',
  component: ParticipantRequestsTable,
} as ComponentMeta<typeof ParticipantRequestsTable>;

const Template: ComponentStory<typeof ParticipantRequestsTable> = (args) => (
  <ParticipantRequestsTable {...args} />
);

export const ParticipantRequests = Template.bind({});

const requestingUser: ParticipantRequestDTO['requestingUser'] = {
  email: 'text@example.com',
  fullName: 'Test User',
  role: UserRole.Engineering,
};
ParticipantRequests.args = {
  participantRequests: [
    {
      id: 1,
      name: 'Participant 1',
      types: [{ id: 1, typeName: 'Type 1' }],
      status: ParticipantStatus.AwaitingApproval,
      requestingUser,
    },
    {
      id: 1,
      name: 'Participant 2',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 2, typeName: 'Type 2' },
      ],
      status: ParticipantStatus.AwaitingApproval,
      requestingUser,
    },
    {
      id: 1,
      name: 'Participant 3',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 2, typeName: 'Type 2' },
        { id: 3, typeName: 'Type 3' },
      ],
      status: ParticipantStatus.AwaitingApproval,
      requestingUser,
    },
    {
      id: 1,
      name: 'Participant 3',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 2, typeName: 'Type 2' },
        { id: 3, typeName: 'Type 3' },
        { id: 4, typeName: 'Type 4' },
      ],
      status: ParticipantStatus.AwaitingApproval,
      requestingUser,
    },
  ],
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
  onApprove: async (_id, form) => {
    console.log(JSON.stringify(form));
  },
};

export const WithErrorWhenApprove = Template.bind({});
WithErrorWhenApprove.args = {
  ...ParticipantRequests.args,
  onApprove: async (_id, _form) => Promise.reject(new Error()),
};

export const NoParticipantRequests = Template.bind({});
NoParticipantRequests.args = {
  participantRequests: [],
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
  onApprove: async (_id, form) => {
    console.log(JSON.stringify(form));
  },
};
