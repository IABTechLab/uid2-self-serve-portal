import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ParticipantSearchBar } from './ParticipantSearchBar';

export default {
  title: 'Sharing Permissions/ParticipantSearchBar',
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
      onToggle={setOpen}
    />
  );
};

export const SearchBar = Template.bind({});
SearchBar.args = {
  participants: [
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
  participantTypes: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
};
