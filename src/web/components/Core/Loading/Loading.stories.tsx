import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  component: Loading,
  title: 'Shared Components/Loading',
};
export default meta;

type Story = StoryObj<typeof Loading>;

export const DefaultMessage: Story = {};
export const CustomMessage: Story = {
  args: {
    message: 'Custom loading message',
  },
};
