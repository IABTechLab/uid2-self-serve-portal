import { Meta, StoryObj } from '@storybook/react';

import ActionButton, { ActionButtonIcon }  from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Shared Components/Action Button',
  component: ActionButton,
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Edit: Story = {
  args: {
    icon: ActionButtonIcon.edit,
  },
};

export const Delete: Story = {
args: {
    icon: ActionButtonIcon.delete,
  },
};
