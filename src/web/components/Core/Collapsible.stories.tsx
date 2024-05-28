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
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: false,
  },
};

export const WithLabel: Story = {
  args: {
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: true,
    label: 'TEST LABEL',
  },
};
