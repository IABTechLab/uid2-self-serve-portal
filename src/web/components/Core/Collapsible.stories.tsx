import { Meta, StoryObj } from '@storybook/react';

import { Collapsible } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Shared Components/Collapsible',
  component: Collapsible,
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Open: Story = {
  args: {
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: true,
  },
};

export const Collapsed: Story = {
  args: {
    ...Open.args,
    defaultOpen: false,
  },
};

export const WithLabel: Story = {
  args: {
    ...Open.args,
    label: 'TEST LABEL',
  },
};
