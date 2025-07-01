import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Shared Components/Label',
  component: Label,
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    text: 'My Label',
  },
};
