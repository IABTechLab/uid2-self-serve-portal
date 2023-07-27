import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SearchAndAddParticipants } from './searchAndAddParticipants';

export default {
  title: 'Sharing Permissions/Search Participants',
  component: SearchAndAddParticipants,
} as ComponentMeta<typeof SearchAndAddParticipants>;

const Template: ComponentStory<typeof SearchAndAddParticipants> = (args) => (
  <SearchAndAddParticipants {...args} />
);

export const Default = Template.bind({});
Default.args = {
  sharingParticipants: [],
  availableParticipants: [
    {
      id: 1,
      siteId: 1,
      name: 'Participant 1',
      types: [{ id: 1, typeName: 'Type 1' }],
    },
    {
      id: 2,
      siteId: 2,
      name: 'Participant 2',
      types: [{ id: 2, typeName: 'Type 2' }],
    },
    {
      id: 3,
      siteId: 3,
      name: 'Participant 3',
      types: [{ id: 3, typeName: 'Type 3' }],
    },
    {
      id: 4,
      siteId: 4,
      name: 'Participant 4',
      types: [{ id: 2, typeName: 'Type 2' }],
    },
  ],
  onSharingPermissionsAdded: (selectedSiteIds) => {
    return Promise.resolve(console.log('selectedSiteIds:', selectedSiteIds));
  },
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
};
