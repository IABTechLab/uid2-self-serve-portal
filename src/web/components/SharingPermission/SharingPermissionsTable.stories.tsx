import { Meta, StoryObj } from '@storybook/react';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { TestAllSitesListProvider } from '../../services/site';
import { SharingPermissionsTable } from './SharingPermissionsTable';

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
  {
    name: 'No SHARER and not explicitly included',
    clientTypes: ['DATA_PROVIDER'],
    id: 16,
    canBeSharedWith: false,
  },
  {
    name: 'No SHARER and explicitly included',
    clientTypes: ['DATA_PROVIDER'],
    id: 17,
    canBeSharedWith: false,
  },
];

const meta: Meta<typeof SharingPermissionsTable> = {
  title: 'Sharing Permissions/Sharing Permissions Table',
  component: SharingPermissionsTable,
  decorators: [
    (Story) => (
      <TestAllSitesListProvider response={response}>
        <Story />
      </TestAllSitesListProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SharingPermissionsTable>;

export const SharedWithParticipants: Story = {
  args: {
    sharedSiteIds: [10, 11, 12, 14, 15, 17],
    sharedTypes: ['DSP', 'DATA_PROVIDER'],
    onDeleteSharingPermission: () => Promise.resolve(),
  },
};
