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
    siteId: 1,
    name: 'Participant 1',
    types: [{ id: 2, typeName: 'Type 2' }],
  },
  onClick: () => {},
  checked: true,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  participant: {
    siteId: 2,
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
    siteId: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
    addedBy: ['Manual'],
  },
  onClick: () => {},
  checked: false,
};

export const AddedByAuto = Template.bind({});
AddedByAuto.args = {
  participant: {
    siteId: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
    addedBy: [{ id: 1, typeName: 'DSP' }],
  },
  onClick: () => {},
  checked: false,
};

export const AddedByAutoAndManual = Template.bind({});
AddedByAutoAndManual.args = {
  participant: {
    siteId: 2,
    name: 'Participant 2',
    types: [
      { id: 3, typeName: 'Type 3' },
      { id: 4, typeName: 'Type 4' },
    ],
    addedBy: ['Manual', { id: 1, typeName: 'DSP' }, { id: 2, typeName: 'Publisher' }],
  },
  onClick: () => {},
  checked: false,
};
