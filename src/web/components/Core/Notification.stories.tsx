import { Meta } from '@storybook/react';

import { Notification } from './Notification';

export default {
  title: 'Shared Components/Notification',
  component: Notification,
} as Meta<typeof Notification>;

export const WithIcon = {
  args: {
    icon: 'check-circle',
    notification: <p>Here is notification</p>,
  },
};

export const WithTitle = {
  args: {
    notification: <p>Here is notification information</p>,
    title: 'An title',
  },
};

export const WithoutIconAndTitle = {
  args: {
    notification: <p>Here is just notification</p>,
  },
};
