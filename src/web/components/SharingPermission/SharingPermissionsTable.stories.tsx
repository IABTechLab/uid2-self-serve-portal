import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { TestAllSitesListProvider } from '../../services/site';
import { SharingPermissionsTable } from './SharingPermissionsTable';

export default {
  title: 'Sharing Permissions/SharingPermissionTable',
  component: SharingPermissionsTable,
} as ComponentMeta<typeof SharingPermissionsTable>;

const response: SharingSiteDTO[] = [
  {
    name: 'Site 1',
    clientTypes: ['PUBLISHER'],
    id: 10,
    canBeSharedWith: true,
  },
  {
    name: 'Site 2',
    clientTypes: ['ADVERTISER'],
    id: 11,
    canBeSharedWith: true,
  },
  {
    name: 'Site 3',
    clientTypes: ['DATA_PROVIDER'],
    id: 12,
    canBeSharedWith: true,
  },
  {
    name: 'Site 4',
    clientTypes: ['DSP'],
    id: 13,
    canBeSharedWith: true,
  },
  {
    name: 'Site 5',
    clientTypes: ['PUBLISHER', 'DSP'],
    id: 14,
    canBeSharedWith: true,
  },
  {
    name: 'Site 6',
    clientTypes: ['ADVERTISER', 'DATA_PROVIDER', 'DSP'],
    id: 15,
    canBeSharedWith: true,
  },
];
const Template: ComponentStory<typeof SharingPermissionsTable> = (args) => (
  <TestAllSitesListProvider response={response}>
    <SharingPermissionsTable {...args} />
  </TestAllSitesListProvider>
);

export const SharedWithParticipants = Template.bind({});
SharedWithParticipants.args = {
  sharedSiteIds: [10, 11, 12, 14, 15],
  sharedTypes: ['DSP', 'DATA_PROVIDER'],
  onDeleteSharingPermission: () => Promise.resolve(),
};
