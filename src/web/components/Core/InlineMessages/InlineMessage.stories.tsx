import { Meta, StoryObj } from '@storybook/react';

import { InlineMessage } from './InlineMessage';

const meta: Meta<typeof InlineMessage> = {
  title: 'Shared Components/Inline Message',
  component: InlineMessage,
};

export default meta;
type Story = StoryObj<typeof InlineMessage>;

export const Info: Story = {
  args: {
    message: 'here is an info',
    type: 'Info',
  },
};

export const Warning: Story = {
  args: {
    message: 'here is a warning',
    type: 'Warning',
  },
};

export const ErrorMessage: Story = {
  args: {
    message: 'here is an error',
    type: 'Error',
  },
};

export const Success: Story = {
  args: {
    message: 'here is a success',
    type: 'Success',
  },
};
