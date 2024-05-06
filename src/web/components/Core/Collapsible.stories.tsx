import { Meta } from '@storybook/react';

import { Collapsible } from './Collapsible';

export default {
  title: 'Shared Components/Collapsible',
  component: Collapsible,
} as Meta<typeof Collapsible>;

export const Open = {
  args: {
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: true,
  },
};

export const Collapsed = {
  args: {
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: false,
  },
};

export const WithLabel = {
  args: {
    title: 'Test Collapsible Title',
    children: 'Test Collapsible Content',
    defaultOpen: true,
    label: 'TEST LABEL',
  },
};
