import { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Shared Components/Card',
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Title',
    description: 'Here is the description',
  },
};

export const NoHeader: Story = {
  args: {
    children: 'test',
  },
};
