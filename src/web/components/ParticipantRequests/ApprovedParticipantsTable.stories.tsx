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
        types: [],
        status: ParticipantStatus.Approved,
        allowSharing: true,
        completedRecommendations: false,
        users: [
          {
            id: 1,
            email: 'test1@example.com',
            firstName: 'First Test User 1',
            lastName: 'Last Test User 1',
            role: UserRole.Marketing,
            acceptedTerms: false,
          },
        ],
      },
      {
        id: 2,
        name: 'Participant 2',
        types: [{ id: 1, typeName: 'Type 1' }],
        status: ParticipantStatus.AwaitingApproval,
        allowSharing: true,
        completedRecommendations: false,
        users: [
          {
            id: 1,
            email: 'tes2@example.com',
            firstName: 'First Test User 2',
            lastName: 'Last Test User 2',
            role: UserRole.Marketing,
            acceptedTerms: false,
          },
        ],
      },
      {
        id: 3,
        name: 'Participant 3',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        allowSharing: true,
        completedRecommendations: false,
        users: [
          {
            id: 3,
            email: 'test3@example.com',
            firstName: 'First Test User 3',
            lastName: 'Last Test User 3',
            role: UserRole.Marketing,
            acceptedTerms: false,
          },
        ],
      },
      {
        id: 4,
        name: 'Participant 4',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
          { id: 3, typeName: 'Type 3' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        allowSharing: true,
        completedRecommendations: false,
        users: [
          {
            id: 4,
            email: 'test4@example.com',
            firstName: 'First Test User 4',
            lastName: 'Last Test User 4',
            role: UserRole.Marketing,
            acceptedTerms: false,
          },
        ],
      },
      {
        id: 5,
        name: 'Participant 5',
        types: [
          { id: 1, typeName: 'Type 1' },
          { id: 2, typeName: 'Type 2' },
          { id: 3, typeName: 'Type 3' },
          { id: 4, typeName: 'Type 4' },
        ],
        status: ParticipantStatus.AwaitingApproval,
        allowSharing: true,
        completedRecommendations: false,
        users: [
          {
            id: 4,
            email: 'test5@example.com',
            firstName: 'First Test User 5',
            lastName: 'Last Test User 5',
            role: UserRole.Marketing,
            acceptedTerms: false,
          },
        ],
      },
    ],
  },
};

export const NoParticipants: Story = {
  args: {
    participants: [],
  },
};
