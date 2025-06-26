import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Shared Components/Notification',
  component: Notification,
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const WithIcon: Story = {
  args: {
    icon: 'check-circle',
    notification: <p>Here is notification</p>,
  },
};

export const WithTitle: Story = {
  args: {
    notification: <p>Here is notification information</p>,
    title: 'An title',
  },
};

export const WithoutIconAndTitle: Story = {
  args: {
    notification: <p>Here is just notification</p>,
  },
};
