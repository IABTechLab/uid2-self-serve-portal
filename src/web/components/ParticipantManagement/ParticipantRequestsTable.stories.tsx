import type { Meta, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import { ParticipantRequestsTable } from './ParticipantRequestsTable';

const meta: Meta<typeof ParticipantRequestsTable> = {
  component: ParticipantRequestsTable,
  title: 'Manage Participants/Participant Requests Table',
};
export default meta;

type Story = StoryObj<typeof ParticipantRequestsTable>;

export const ParticipantRequests: Story = {
  args: {
    participantRequests: [
      {
        id: 1,
        name: 'Participant 1',

        types: [{ id: 1, typeName: 'Type 1' }],
        status: ParticipantStatus.AwaitingApproval,
        requestingUser: {
          email: 'test1@example.com',
          fullName: 'Test User  1',
          role: UserRole.Engineering,
        },
      },
      {
        id: 2,
        name: 'Participant 2',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        requestingUser: {
          email: 'test2@example.com',
          fullName: 'Test User 2',
          role: UserRole.BusinessDevelopment,
        },
      },
      {
        id: 3,
        name: 'Participant 3',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
          { id: 3, typeName: 'Type 3' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        requestingUser: {
          email: 'test3@example.com',
          fullName: 'Test User 3',
          role: UserRole.Marketing,
        },
      },
      {
        id: 4,
        name: 'Participant 3',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
          { id: 3, typeName: 'Type 3' },
          { id: 4, typeName: 'Type 4' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        requestingUser: {
          email: 'test4@example.com',
          fullName: 'Test User 4',
          role: UserRole.MediaBuyer,
        },
      },
    ],
    participantTypes: [
      { id: 1, typeName: 'Type 1' },
      { id: 2, typeName: 'Type 2' },
      { id: 3, typeName: 'Type 3' },
    ],
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ],
    onApprove: async (_id, form) => {
      console.log(JSON.stringify(form));
    },
  },
};

export const WithErrorWhenApprove: Story = {
  args: {
    ...ParticipantRequests.args,
    onApprove: async (_id, _form) => Promise.reject(new Error()),
  },
};

export const NoParticipantRequests: Story = {
  args: {
    participantRequests: [],
    participantTypes: [
      { id: 1, typeName: 'Type 1' },
      { id: 2, typeName: 'Type 2' },
      { id: 3, typeName: 'Type 3' },
    ],
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ],
    onApprove: async (_id, form) => {
      console.log(JSON.stringify(form));
    },
  },
};
