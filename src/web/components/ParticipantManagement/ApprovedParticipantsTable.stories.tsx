import type { Meta, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserJobFunction } from '../../../api/entities/User';
import ApprovedParticipantsTable from './ApprovedParticipantsTable';

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
        id: 2,
        name: 'Participant 2',
        types: [{ id: 1, typeName: 'Type 1' }],
        apiRoles: [],
        status: ParticipantStatus.Approved,
        allowSharing: true,
        completedRecommendations: false,
        approver: {
          id: 1,
          email: 'tes2@example.com',
          firstName: 'Approver 2 First Name +',
          lastName: 'Approver 2 Last Name',
          jobFunction: UserJobFunction.Marketing,
          acceptedTerms: false,
        },
        dateApproved: new Date(),
        crmAgreementNumber: '12345678',
        users: [
          {
            id: 1,
            email: 'tes2@example.com',
            firstName: 'First Test User 2',
            lastName: 'Last Test User 2',
            jobFunction: UserJobFunction.Marketing,
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
        apiRoles: [{ id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 }],
        status: ParticipantStatus.Approved,
        allowSharing: true,
        completedRecommendations: false,
        approver: {
          id: 1,
          email: 'tes3@example.com',
          firstName: 'Approver 3 First Name +',
          lastName: 'Approver 3 Last Name',
          jobFunction: UserJobFunction.Marketing,
          acceptedTerms: false,
        },
        dateApproved: new Date(),
        crmAgreementNumber: '23456789',
        users: [
          {
            id: 3,
            email: 'test3@example.com',
            firstName: 'First Test User 3',
            lastName: 'Last Test User 3',
            jobFunction: UserJobFunction.Marketing,
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
        apiRoles: [
          { id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 },
          { id: 2, roleName: 'Role2', externalName: 'Role 2', order: 2 },
        ],
        status: ParticipantStatus.Approved,
        allowSharing: true,
        completedRecommendations: false,
        approver: {
          id: 1,
          email: 'tes4@example.com',
          firstName: 'Approver 4 First Name +',
          lastName: 'Approver 4 Last Name',
          jobFunction: UserJobFunction.Marketing,
          acceptedTerms: false,
        },
        dateApproved: new Date(),
        crmAgreementNumber: '34567890',
        users: [
          {
            id: 4,
            email: 'test4@example.com',
            firstName: 'First Test User 4',
            lastName: 'Last Test User 4',
            jobFunction: UserJobFunction.Marketing,
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
        apiRoles: [
          { id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 },
          { id: 2, roleName: 'Role2', externalName: 'Role 2', order: 2 },
          { id: 3, roleName: 'Role3', externalName: 'Role 3', order: 3 },
        ],
        status: ParticipantStatus.Approved,
        allowSharing: true,
        completedRecommendations: false,
        crmAgreementNumber: '45678901',
        users: [
          {
            id: 4,
            email: 'test5@example.com',
            firstName: 'First Test User 5',
            lastName: 'Last Test User 5',
            jobFunction: UserJobFunction.Marketing,
            acceptedTerms: false,
          },
        ],
      },
    ],
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 },
      { id: 2, roleName: 'Role2', externalName: 'Role 2', order: 2 },
      { id: 3, roleName: 'Role3', externalName: 'Role 3', order: 3 },
      { id: 4, roleName: 'Role4', externalName: 'Role 4', order: 4 },
    ],
  },
};

export const NoParticipants: Story = {
  args: {
    participants: [],
    onUpdateParticipant: (form, participant) => {
      console.log(form);
      console.log(participant);
      return Promise.resolve();
    },
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1', order: 1 },
      { id: 2, roleName: 'Role2', externalName: 'Role 2', order: 2 },
      { id: 3, roleName: 'Role3', externalName: 'Role 3', order: 3 },
      { id: 4, roleName: 'Role4', externalName: 'Role 4', order: 4 },
    ],
  },
};
