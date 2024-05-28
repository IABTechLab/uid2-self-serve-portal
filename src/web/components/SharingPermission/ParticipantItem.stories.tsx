import { Meta, StoryObj } from '@storybook/react';

import { ParticipantItem } from './ParticipantItem';

const meta: Meta<typeof ParticipantItem> = {
  title: 'Sharing Permissions/Participant Item',
  component: ParticipantItem,
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ParticipantItem>;

export const Checked: Story = {
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

export const Unchecked: Story = {
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

export const AddedByManual: Story = {
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

export const AddedByAuto: Story = {
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

export const AddedByAutoAndManual: Story = {
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
