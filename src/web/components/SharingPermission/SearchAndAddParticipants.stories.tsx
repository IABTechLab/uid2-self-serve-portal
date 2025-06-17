import { Meta, StoryObj } from '@storybook/react-webpack5';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { TestAvailableSiteListProvider } from '../../services/site';
import { SearchAndAddParticipants } from './SearchAndAddParticipants';

const response: SharingSiteDTO[] = [
  {
    id: 1,
    name: 'Test Publisher',
    clientTypes: ['PUBLISHER'],
    canBeSharedWith: true,
  },
  {
    id: 2,
    name: 'Test Advertiser',
    clientTypes: ['ADVERTISER'],
    canBeSharedWith: true,
  },
  {
    id: 3,
    name: 'Test DSP',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
  },
  {
    id: 4,
    name: 'Test Data Provider',
    clientTypes: ['DATA_PROVIDER'],
    canBeSharedWith: true,
  },
  {
    id: 5,
    name: 'Test with all types',
    clientTypes: ['PUBLISHER', 'ADVERTISER', 'DSP', 'DATA_PROVIDER'],
    canBeSharedWith: true,
  },
];

const meta: Meta<typeof SearchAndAddParticipants> = {
  title: 'Sharing Permissions/Search and Add Participants',
  component: SearchAndAddParticipants,
  decorators: [
    (Story) => (
      <TestAvailableSiteListProvider response={response}>
        <Story />
      </TestAvailableSiteListProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SearchAndAddParticipants>;

export const Default: Story = {
  args: {
    sharedSiteIds: [],
    onSharingPermissionsAdded: (selectedSiteIds) => {
      return Promise.resolve(console.log('selectedSiteIds:', selectedSiteIds));
    },
  },
};
