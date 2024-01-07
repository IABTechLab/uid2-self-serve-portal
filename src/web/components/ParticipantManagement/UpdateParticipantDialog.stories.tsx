/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import UpdateParticipantDialog from './UpdateParticipantDialog';

const meta: Meta<typeof UpdateParticipantDialog> = {
  component: UpdateParticipantDialog,
  title: 'Manage Participants/Update Participants Dialog',
};
export default meta;

type Story = StoryObj<typeof UpdateParticipantDialog>;

export const ParticipantWithExistingRoles: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1' },
      { id: 2, roleName: 'Role2', externalName: 'Role 2' },
      { id: 3, roleName: 'Role3', externalName: 'Role 3' },
      { id: 4, roleName: 'Role4', externalName: 'Role 4' },
    ],
    participant: {
      id: 5,
      name: 'Participant 5',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 2, typeName: 'Type 2' },
        { id: 3, typeName: 'Type 3' },
        { id: 4, typeName: 'Type 4' },
      ],
      apiRoles: [
        { id: 1, roleName: 'Role1', externalName: 'Role 1' },
        { id: 2, roleName: 'Role2', externalName: 'Role 2' },
        { id: 3, roleName: 'Role3', externalName: 'Role 3' },
      ],
      status: ParticipantStatus.Approved,
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
    onUpdateParticipant: (form) => {
      console.log(form);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};

export const ParticipantWithNoRoles: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'Role1', externalName: 'Role 1' },
      { id: 2, roleName: 'Role2', externalName: 'Role 2' },
      { id: 3, roleName: 'Role3', externalName: 'Role 3' },
      { id: 4, roleName: 'Role4', externalName: 'Role 4' },
    ],
    participant: {
      id: 5,
      name: 'Participant 5',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 2, typeName: 'Type 2' },
        { id: 3, typeName: 'Type 3' },
        { id: 4, typeName: 'Type 4' },
      ],
      apiRoles: [
        { id: 1, roleName: 'Role1', externalName: 'Role 1' },
        { id: 2, roleName: 'Role2', externalName: 'Role 2' },
        { id: 3, roleName: 'Role3', externalName: 'Role 3' },
      ],
      status: ParticipantStatus.Approved,
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
    onUpdateParticipant: (form, participant) => {
      console.log(form);
      console.log(participant);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};
