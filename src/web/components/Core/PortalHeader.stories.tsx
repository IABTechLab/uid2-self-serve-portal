import { Meta, StoryObj } from '@storybook/react';

import { PortalHeader } from './PortalHeader';

const meta: Meta<typeof PortalHeader> = {
  title: 'Shared Components/Portal Header',

  component: PortalHeader,
};

export default meta;
type Story = StoryObj<typeof PortalHeader>;

export const ValidEmailAddress: Story = {
  args: {
    fullName: 'Test User',
    email: 'test.user@example.com',
  },
};

export const InvalidEmailAddress: Story = {
  args: {
    email: '123',
  },
};

export const NoEmailAddress: Story = {
  args: {},
};
