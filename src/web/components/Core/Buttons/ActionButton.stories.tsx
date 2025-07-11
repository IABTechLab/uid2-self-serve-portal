import { Meta, StoryObj } from '@storybook/react-webpack5';

import ActionButton from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Shared Components/Action Button',
  component: ActionButton,
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Edit: Story = {
  args: {
    icon: 'pencil',
  },
};

export const Delete: Story = {
  args: {
    icon: 'trash-can',
  },
};
