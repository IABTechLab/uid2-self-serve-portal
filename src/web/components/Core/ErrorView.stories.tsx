import type { Meta, StoryObj } from '@storybook/react';

import ErrorView from './ErrorView';

import '../../utils/errorHandler.scss';

const meta: Meta<typeof ErrorView> = {
  component: ErrorView,
  title: 'Shared Components/Error View',
  decorators: [(Story) => <Story />],
};
export default meta;

type Story = StoryObj<typeof ErrorView>;

export const Default: Story = {};

export const WithErrorId: Story = {
  args: {
    errorId: 'this is an errorId',
  },
};

export const WithErrorHash: Story = {
  args: {
    errorHash: 'this is an errorHash',
  },
};

export const WithErrorIdAndMessage: Story = {
  args: {
    message: 'this is a custom error message',
    errorId: 'this is an errorId',
  },
};

export const WithErrorIdAndErrorHash: Story = {
  args: {
    errorId: '1234-5678-abcd-efgh',
    errorHash: 'this is an errorHash',
  },
};
