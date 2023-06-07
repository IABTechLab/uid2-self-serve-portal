import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantPayload } from '../../services/participant';
import { ParticipantsTable } from './ParticipantsTable';

export default {
  title: 'Sharing Permissions/ParticipantsTable',
  component: ParticipantsTable,
} as ComponentMeta<typeof ParticipantsTable>;

const Template: ComponentStory<typeof ParticipantsTable> = (args) => (
  <ParticipantsTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  participants: [
    { id: 1, name: 'Participant 1', types: [{ id: 1, typeName: 'Type 1' }] },
    { id: 2, name: 'Participant 2', types: [{ id: 2, typeName: 'Type 2' }] },
  ] as ParticipantPayload[],
  filterText: '',
  onSelectedChange: (selectedItems: number[]) => console.log('Selected items:', selectedItems),
};
