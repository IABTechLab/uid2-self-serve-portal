import type { Meta, StoryObj } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { UserRole } from '../../../api/entities/User';
import UpdateParticipantDialog from './UpdateParticipantDialog';

const meta: Meta<typeof UpdateParticipantDialog> = {
  component: UpdateParticipantDialog,
  title: 'Manage Participants/Update Participant Dialog',
};
export default meta;

type Story = StoryObj<typeof UpdateParticipantDialog>;

export const ParticipantWithExistingRoles: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ],
    participantTypes: [
      { id: 1, typeName: 'DSP' },
      { id: 2, typeName: 'Advertiser' },
      { id: 3, typeName: 'Data Provider' },
      { id: 4, typeName: 'Publisher' },
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
        { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
        { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
        { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      ],
      status: ParticipantStatus.Approved,
      allowSharing: true,
      completedRecommendations: false,
      crmAgreementNumber: '12345678',
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

export const ParticipantWithNoRolesOrTypes: Story = {
  args: {
    apiRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ],
    participantTypes: [
      { id: 1, typeName: 'DSP' },
      { id: 2, typeName: 'Advertiser' },
      { id: 3, typeName: 'Data Provider' },
      { id: 4, typeName: 'Publisher' },
    ],
    participant: {
      id: 5,
      name: 'Participant 5',
      types: [],
      apiRoles: [],
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
