import type { Meta, StoryObj } from '@storybook/react';

import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  component: Loading,
};
export default meta;

type Story = StoryObj<typeof Loading>;

export const DefaultMessage: Story = {};
export const CustomMessage: Story = {
  args: {
    message: 'Custom loading message',
  },
};
