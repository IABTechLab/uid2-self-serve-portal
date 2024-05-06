import { Meta } from '@storybook/react';

import { InlineMessage } from './InlineMessage';

export default {
  title: 'Shared Components/Inline Message',
  component: InlineMessage,
} as Meta<typeof InlineMessage>;

export const Info = {
  args: {
    message: 'here is an info',
    type: 'Info',
  },
};

export const Warning = {
  args: {
    message: 'here is a warning',
    type: 'Warning',
  },
};

export const ErrorMessage = {
  args: {
    message: 'here is an error',
    type: 'Error',
  },
};

export const Success = {
  args: {
    message: 'here is a success',
    type: 'Success',
  },
};
