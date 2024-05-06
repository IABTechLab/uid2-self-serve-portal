import { Meta } from '@storybook/react';

import { Banner } from './Banner';

export default {
  title: 'Shared Components/Banner',
  component: Banner,
} as Meta<typeof Banner>;

export const Info = {
  args: {
    message: 'here is an info banner',
    type: 'Info',
  },
};

export const Warning = {
  args: {
    message: 'here is a warning banner',
    type: 'Warning',
  },
};

export const ErrorBanner = {
  args: {
    message: 'here is an error banner',
    type: 'Error',
  },
};

export const Success = {
  args: {
    message: 'here is a success banner',
    type: 'Success',
  },
};
