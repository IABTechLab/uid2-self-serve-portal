import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TestAvailableSiteListProvider } from '../../services/site';
import { SharingPermissionsTable } from './SharingPermissionsTable';

export default {
  title: 'Sharing Permissions/SharingPermissionTable',
  component: SharingPermissionsTable,
} as ComponentMeta<typeof SharingPermissionsTable>;

const response: AvailableParticipantDTO[] = [
  {
    name: 'Site 1',
    types: [{ id: 1, typeName: 'Publisher' }],
    siteId: 10,
  },
  {
    name: 'Site 2',
    types: [{ id: 2, typeName: 'Advertiser' }],
    siteId: 11,
  },
  {
    name: 'Site 3',
    types: [{ id: 3, typeName: 'Data Provider' }],
    siteId: 12,
  },
  {
    name: 'Site 4',
    types: [{ id: 4, typeName: 'DSP' }],
    siteId: 13,
  },
  {
    name: 'Site 5',
    types: [
      { id: 1, typeName: 'Publisher' },
      { id: 4, typeName: 'DSP' },
    ],
    siteId: 14,
  },
  {
    name: 'Site 6',
    types: [
      { id: 1, typeName: 'Advertiser' },
      { id: 3, typeName: 'Data Provider' },
      { id: 4, typeName: 'DSP' },
    ],
    siteId: 15,
  },
];
const Template: ComponentStory<typeof SharingPermissionsTable> = (args) => (
  <TestAvailableSiteListProvider response={response}>
    <SharingPermissionsTable {...args} />
  </TestAvailableSiteListProvider>
);

export const SharedWithParticipants = Template.bind({});
SharedWithParticipants.args = {
  sharedSiteIds: [10, 11, 12, 14, 15],
  sharedTypes: ['DSP', 'DATA_PROVIDER'],
  onDeleteSharingPermission: () => Promise.resolve(),
  participantTypes: [
    { id: 1, typeName: 'Publisher' },
    { id: 2, typeName: 'Advertiser' },
    { id: 3, typeName: 'Data Provider' },
    { id: 4, typeName: 'DSP' },
  ],
};
