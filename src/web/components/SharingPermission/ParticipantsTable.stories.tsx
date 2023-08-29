import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { ParticipantsTable } from './ParticipantsTable';

export default {
  title: 'Sharing Permissions/ParticipantsTable',
  component: ParticipantsTable,
} as ComponentMeta<typeof ParticipantsTable>;
const Template: ComponentStory<typeof ParticipantsTable> = (args) => {
  return <ParticipantsTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  tableHeader: () => (
    <>
      <th>Participant Name</th>
      <th>Participant Type</th>
    </>
  ),
  participants: [
    { siteId: 1, name: 'Participant 1', types: [{ id: 1, typeName: 'Type 1' }] },
    { siteId: 2, name: 'Participant 2', types: [{ id: 2, typeName: 'Type 2' }] },
  ] as AvailableParticipantDTO[],
  filterText: '',
  onSelectedChange: (selectedItems: Set<number>) => console.log('Selected items:', selectedItems),
};

export const HideSelectAllCheckbox = Template.bind({});
HideSelectAllCheckbox.args = {
  ...Default.args,
  hideSelectAllCheckbox: true,
};
