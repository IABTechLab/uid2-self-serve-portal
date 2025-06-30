import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Shared Components/Notification',
  component: Notification,
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const WithIcon = {
  args: {
    icon: 'check-circle' as IconProp,
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
