import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Banner, BannerProps } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Shared Components/Banner',
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Info = {
  args: {
    message: 'here is an info banner',
    type: 'Info' as BannerProps["type"],
  },
};

export const Warning: Story = {
  args: {
    message: 'here is a warning banner',
    type: 'Warning',
  },
};

export const ErrorBanner: Story = {
  args: {
    message: 'here is an error banner',
    type: 'Error',
  },
};

export const Success: Story = {
  args: {
    message: 'here is a success banner',
    type: 'Success',
  },
};
