import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ParticipantItem } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/Participant Item',
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
  site: {
    id: 1,
    name: 'Participant 1',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
  },
  onClick: () => {},
  checked: true,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  site: {
    id: 2,
    name: 'Participant 2',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
  },
  onClick: () => {},
  checked: false,
};

export const AddedByManual = Template.bind({});
AddedByManual.args = {
  site: {
    id: 2,
    name: 'Participant 2',
    clientTypes: ['DSP'],
    canBeSharedWith: true,
    addedBy: ['Manual'],
  },
  onClick: () => {},
  checked: false,
};

export const AddedByAuto = Template.bind({});
AddedByAuto.args = {
  site: {
    id: 2,
    name: 'Participant 2',
    clientTypes: ['DSP', 'PUBLISHER'],
    canBeSharedWith: true,
    addedBy: ['DSP'],
  },
  onClick: () => {},
  checked: false,
};

export const AddedByAutoAndManual = Template.bind({});
AddedByAutoAndManual.args = {
  site: {
    id: 2,
    name: 'Participant 2',
    clientTypes: ['DSP', 'PUBLISHER'],
    addedBy: ['Manual', 'DSP', 'PUBLISHER'],
    canBeSharedWith: true,
  },
  onClick: () => {},
  checked: false,
};
