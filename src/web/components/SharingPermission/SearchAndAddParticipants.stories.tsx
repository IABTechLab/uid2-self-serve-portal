import { Meta, StoryFn } from '@storybook/react';

import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { TestAvailableSiteListProvider } from '../../services/site';
import { SearchAndAddParticipants } from './SearchAndAddParticipants';

export default {
  title: 'Sharing Permissions/Search and Add Participants',
  component: SearchAndAddParticipants,
} as Meta<typeof SearchAndAddParticipants>;

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

const Template: StoryFn<typeof SearchAndAddParticipants> = (args) => (
  <TestAvailableSiteListProvider response={response}>
    <SearchAndAddParticipants {...args} />
  </TestAvailableSiteListProvider>
);

export const Default = {
  render: Template,

  args: {
    sharedSiteIds: [],

    onSharingPermissionsAdded: (selectedSiteIds) => {
      return Promise.resolve(console.log('selectedSiteIds:', selectedSiteIds));
    },
  },
};
