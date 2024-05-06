import { Meta, StoryFn } from '@storybook/react';

import { ParticipantItem } from './ParticipantItem';

export default {
  title: 'Sharing Permissions/ParticipantItem',
  component: ParticipantItem,
} as Meta<typeof ParticipantItem>;

const Template: StoryFn<typeof ParticipantItem> = (args) => (
  <table>
    <tbody>
      <ParticipantItem {...args} />
    </tbody>
  </table>
);

export const Checked = {
  render: Template,

  args: {
    site: {
      id: 1,
      name: 'Participant 1',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: true,
  },
};

export const Unchecked = {
  render: Template,

  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByManual = {
  render: Template,

  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP'],
      canBeSharedWith: true,
      addedBy: ['Manual'],
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByAuto = {
  render: Template,

  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP', 'PUBLISHER'],
      canBeSharedWith: true,
      addedBy: ['DSP'],
    },
    onClick: () => {},
    checked: false,
  },
};

export const AddedByAutoAndManual = {
  render: Template,

  args: {
    site: {
      id: 2,
      name: 'Participant 2',
      clientTypes: ['DSP', 'PUBLISHER'],
      addedBy: ['Manual', 'DSP', 'PUBLISHER'],
      canBeSharedWith: true,
    },
    onClick: () => {},
    checked: false,
  },
};
