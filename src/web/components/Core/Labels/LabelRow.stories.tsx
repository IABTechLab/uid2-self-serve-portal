import { Meta, StoryObj } from '@storybook/react';

import { LabelRow } from './LabelRow';

const meta: Meta<typeof LabelRow> = {
  title: 'Shared Components/LabelRow',
  component: LabelRow,
};
export default meta;
type Story = StoryObj<typeof LabelRow>;

export const Default: Story = {
  args: {
    labelNames: ['Label 1', 'Label 2', 'Label 3'],
  },
};
