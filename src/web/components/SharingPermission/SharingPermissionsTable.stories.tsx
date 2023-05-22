import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { SharingPermissionsTable } from './SharingPermissionsTable';

export default {
  title: 'Sharing Permissions/SharingPermissionTable',
  component: SharingPermissionsTable,
} as ComponentMeta<typeof SharingPermissionsTable>;

const Template: ComponentStory<typeof SharingPermissionsTable> = (args) => (
  <SharingPermissionsTable {...args} />
);

export const SharedWithParticipants = Template.bind({});
SharedWithParticipants.args = {
  sharedParticipants: [
    {
      id: 1,
      name: 'Participant 1',
      types: [{ id: 1, typeName: 'Type 1' }],
      status: ParticipantStatus.Approved,
    },
    {
      id: 2,
      name: 'Participant 2',
      types: [{ id: 2, typeName: 'Type 2' }],
      status: ParticipantStatus.Approved,
    },
    {
      id: 3,
      name: 'Participant 3',
      types: [{ id: 3, typeName: 'Type 3' }],
      status: ParticipantStatus.Approved,
    },
    {
      id: 4,
      name: 'Participant 4',
      types: [{ id: 2, typeName: 'Type 2' }],
      status: ParticipantStatus.Approved,
    },
  ],
};

export const NotShared = Template.bind({});
NotShared.args = {
  sharedParticipants: [],
};
