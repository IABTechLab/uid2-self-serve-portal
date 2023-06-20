import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ParticipantStatus } from '../../../api/entities/Participant';
import { ParticipantSearchBar } from './ParticipantSearchBar';

export default {
  title: 'Sharing Permissions/ParticipantSearchBar',
  component: ParticipantSearchBar,
} as ComponentMeta<typeof ParticipantSearchBar>;

const Template: ComponentStory<typeof ParticipantSearchBar> = (args) => {
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set([1, 3]));
  return (
    <ParticipantSearchBar
      {...args}
      selectedParticipantIds={selectedParticipants}
      onSelectedChange={setSelectedParticipants}
    />
  );
};

export const SearchBar = Template.bind({});
SearchBar.args = {
  participants: [
    {
      id: 1,
      name: 'Participant 1',
      types: [{ id: 1, typeName: 'Type 1' }],
      status: ParticipantStatus.Approved,
      allowSharing: true,
    },
    {
      id: 2,
      name: 'Participant 2',
      types: [{ id: 2, typeName: 'Type 2' }],
      status: ParticipantStatus.Approved,
      allowSharing: true,
    },
    {
      id: 3,
      name: 'Participant 3',
      types: [{ id: 3, typeName: 'Type 3' }],
      status: ParticipantStatus.Approved,
      allowSharing: true,
    },
    {
      id: 4,
      name: 'Participant 4',
      types: [{ id: 2, typeName: 'Type 2' }],
      status: ParticipantStatus.Approved,
      allowSharing: true,
    },
  ],
};
