import { ComponentMeta, ComponentStory } from '@storybook/react';

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
  sharingParticipants: [
    {
      id: 1,
      name: 'Participant 1',
      types: [{ id: 1, typeName: 'Type 1' }],
      siteId: 1,
    },
    {
      id: 2,
      name: 'Participant 2',
      types: [{ id: 2, typeName: 'Type 2' }],
      siteId: 2,
    },
    {
      id: 3,
      name: 'Participant 3',
      types: [{ id: 3, typeName: 'Type 3' }],
      siteId: 3,
    },
    {
      id: 4,
      name: 'Participant 4',
      types: [{ id: 4, typeName: 'Type 4' }],
      siteId: 4,
    },
    {
      id: 5,
      name: 'Participant 5',
      types: [
        { id: 1, typeName: 'Type 1' },
        { id: 4, typeName: 'Type 4' },
      ],
      siteId: 5,
    },
  ],
  onDeleteSharingPermission: () => Promise.resolve(),
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
    { id: 4, typeName: 'Type 4' },
  ],
};

export const NotShared = Template.bind({});
NotShared.args = {
  sharingParticipants: [],
  onDeleteSharingPermission: () => Promise.resolve(),
};
