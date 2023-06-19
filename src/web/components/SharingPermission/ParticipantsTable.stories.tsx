import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ParticipantResponse } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';

export default {
  title: 'Sharing Permissions/ParticipantsTable',
  component: ParticipantsTable,
} as ComponentMeta<typeof ParticipantsTable>;

const Template: ComponentStory<typeof ParticipantsTable> = (args) => {
  const participants = [
    { id: 1, name: 'Participant 1', types: [{ id: 1, typeName: 'Type 1' }] },
    { id: 2, name: 'Participant 2', types: [{ id: 2, typeName: 'Type 2' }] },
  ] as ParticipantResponse[];
  const [filteredParticipants, setFilteredParticipants] =
    useState<ParticipantResponse[]>(participants);

  return (
    <ParticipantsTable
      {...args}
      participants={participants}
      filteredParticipants={filteredParticipants}
      onFilteredParticipantChange={setFilteredParticipants}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  filterText: '',
  onSelectedChange: (selectedItems: number[]) => console.log('Selected items:', selectedItems),
};
