import { Meta } from '@storybook/react';

import { Card } from './Card';

export default {
  title: 'Shared Components/Card',
  component: Card,
} as Meta<typeof Card>;

export const WithTitle = {
  args: {
    title: 'Card Title',
  },
};

export const WithDescription = {
  args: {
    title: 'Title',
    description: 'Here is the description',
  },
};

export const NoHeader = {
  args: {
    children: 'test',
  },
};
