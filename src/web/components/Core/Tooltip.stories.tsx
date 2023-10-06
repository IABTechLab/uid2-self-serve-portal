import { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from './Tooltip';

export default {
  title: 'Shared Components/Tooltip',
  component: Tooltip,
} as Meta<typeof Tooltip>;

type Story = StoryObj<typeof Tooltip>;
export const Default: Story = {
  args: {
    children: 'Default tooltip',
  },
};

export const WithCustomTrigger: Story = {
  args: {
    children: 'With custom trigger',
    trigger: 'My custom trigger',
  },
};

export const WithSide: Story = {
  args: {
    children: 'With side',
    side: 'left',
  },
};

export const WithAlign: Story = {
  args: {
    children: 'With align',
    align: 'start',
  },
};
