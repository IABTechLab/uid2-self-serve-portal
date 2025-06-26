import { Meta } from '@storybook/react-webpack5';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Shared Components/Card',
  component: Card,
};
export default meta;

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
