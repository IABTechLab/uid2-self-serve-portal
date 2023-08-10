import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantItem } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/ParticipantItem',
  component: ParticipantItem,
} as ComponentMeta<typeof ParticipantItem>;

const Template: ComponentStory<typeof ParticipantItem> = (args) => (
  <table>
    <tbody>
      <ParticipantItem {...args} />
    </tbody>
  </table>
);

export const Checked = Template.bind({});
Checked.args = {
  participant: {
    id: 1,
    name: 'Participant 1',
    types: [{ id: 2, typeName: 'Type 2' }],
  },
  onClick: () => {},
  checked: true,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  participant: {
    id: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
  },
  onClick: () => {},
  checked: false,
};

export const AddedByManual = Template.bind({});
AddedByManual.args = {
  participant: {
    id: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
  },
  onClick: () => {},
  checked: false,
  addedBy: 'Manual',
};

export const AddedByAuto = Template.bind({});
AddedByAuto.args = {
  participant: {
    id: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
  },
  onClick: () => {},
  checked: false,
  addedBy: 'Auto',
};

export const AddedByAutoAndManual = Template.bind({});
AddedByAutoAndManual.args = {
  participant: {
    id: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
  },
  onClick: () => {},
  checked: false,
  addedBy: 'Auto/Manual',
};