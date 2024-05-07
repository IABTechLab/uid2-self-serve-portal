import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ParticipantSearchBar } from './ParticipantSearchBar';

export default {
  title: 'Sharing Permissions/Participant Search Bar',
  component: ParticipantSearchBar,
} as ComponentMeta<typeof ParticipantSearchBar>;

const Template: ComponentStory<typeof ParticipantSearchBar> = (args) => {
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set([1, 3]));
  const [open, setOpen] = useState<boolean>(false);
  return (
    <ParticipantSearchBar
      {...args}
      selectedParticipantIds={selectedParticipants}
      onSelectedChange={setSelectedParticipants}
      open={open}
      onToggleOpen={setOpen}
    />
  );
};

export const SearchBar = Template.bind({});
SearchBar.args = {
  sites: [
    {
      id: 1,
      name: 'Participant 1',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
    },
    {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['PUBLISHER'],
      canBeSharedWith: true,
    },
    {
      id: 3,
      name: 'Participant 3',
      clientTypes: ['DATA_PROVIDER'],
      canBeSharedWith: true,
    },
    {
      id: 4,
      name: 'Participant 4',
      clientTypes: ['PUBLISHER'],
      canBeSharedWith: true,
    },
  ],
};
