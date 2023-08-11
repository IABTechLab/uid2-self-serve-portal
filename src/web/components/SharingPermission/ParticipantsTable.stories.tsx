import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { ParticipantsTable } from './ParticipantsTable';
import { ParticipantsTableDemo } from './ParticipantsTableDemo';
import { ParticipantsTableReactTableDemo } from './ParticipantsTableReactTableDemo';

export default {
  title: 'Sharing Permissions/ParticipantsTable',
  component: ParticipantsTable,
} as ComponentMeta<typeof ParticipantsTable>;
const Template: ComponentStory<typeof ParticipantsTable> = (args) => {
  return <ParticipantsTable {...args} />;
};

const AgGridTemplate: ComponentStory<typeof ParticipantsTable> = (args) => {
  return <ParticipantsTableDemo {...args} />;
};

const ReactTableTemplate: ComponentStory<typeof ParticipantsTable> = (args) => {
  return <ParticipantsTableReactTableDemo {...args} />;
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
    { id: 1, name: 'Participant 1', types: [{ id: 1, typeName: 'Type 1' }], siteId: 1 },
    {
      id: 2,
      name: 'Participant 2',
      siteId: 2,
      types: [
        { id: 2, typeName: 'Type 2' },
        { id: 1, typeName: 'Type 1' },
      ],
    },
  ] as AvailableParticipantDTO[],
  onSelectedChange: (selectedItems: Set<number>) => console.log('Selected items:', selectedItems),
};

export const AgGridDemo = AgGridTemplate.bind({});
AgGridDemo.args = Default.args;

export const ReactTableDemo = ReactTableTemplate.bind({});
ReactTableDemo.args = Default.args;
