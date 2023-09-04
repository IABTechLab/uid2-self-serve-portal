import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { TestAvailableSiteListProvider } from '../../services/site';
import { SearchAndAddParticipants } from './SearchAndAddParticipants';

export default {
  title: 'Sharing Permissions/Search and Add Participants',
  component: SearchAndAddParticipants,
} as ComponentMeta<typeof SearchAndAddParticipants>;

const response: AvailableParticipantDTO[] = [
  {
    siteId: 1,
    name: 'Test Publisher',
    types: [{ id: 4, typeName: 'Publisher' }],
  },
  {
    siteId: 2,
    name: 'Test Advertiser',
    types: [{ id: 2, typeName: 'Advertiser' }],
  },
  {
    siteId: 3,
    name: 'Test DSP',
    types: [{ id: 1, typeName: 'DSP' }],
  },
  {
    siteId: 4,
    name: 'Test Data Provider',
    types: [{ id: 3, typeName: 'Data Provider' }],
  },
  {
    siteId: 5,
    name: 'Test with all types',
    types: [
      { id: 4, typeName: 'Publisher' },
      { id: 2, typeName: 'Advertiser' },
      { id: 1, typeName: 'DSP' },
      { id: 3, typeName: 'Data Provider' },
    ],
  },
];

const Template: ComponentStory<typeof SearchAndAddParticipants> = (args) => (
  <TestAvailableSiteListProvider response={response}>
    <SearchAndAddParticipants {...args} />
  </TestAvailableSiteListProvider>
);

export const Default = Template.bind({});
Default.args = {
  sharedSiteIds: [],

  onSharingPermissionsAdded: (selectedSiteIds) => {
    return Promise.resolve(console.log('selectedSiteIds:', selectedSiteIds));
  },
  participantTypes: [
    { id: 1, typeName: 'DSP' },
    { id: 2, typeName: 'Advertiser' },
    { id: 3, typeName: 'Data Provider' },
    { id: 4, typeName: 'Publisher' },
  ],
};
