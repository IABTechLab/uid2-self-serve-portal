import type { Meta, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import { ApprovedParticipantsTable } from './ApprovedParticipantsTable';

const meta: Meta<typeof ApprovedParticipantsTable> = {
  component: ApprovedParticipantsTable,
  title: 'Manage Participants/All Participants Table',
};
export default meta;

type Story = StoryObj<typeof ApprovedParticipantsTable>;

export const AllParticipants: Story = {
  args: {
    participants: [
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
  },
};

export const NoParticipants: Story = {
  args: {
    participants: [],
  },
};
