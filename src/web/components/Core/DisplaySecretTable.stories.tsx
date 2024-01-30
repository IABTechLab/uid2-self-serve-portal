/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';

import DisplaySecretTable from './DisplaySecretTable';

const meta: Meta<typeof DisplaySecretTable> = {
  component: DisplaySecretTable,
  title: 'Shared Components/Display Secret Table',
};
export default meta;

type Story = StoryObj<typeof DisplaySecretTable>;

export const LongValue: Story = {
  args: {
    secret: { valueName: 'Example_Secret', value: '6XlnVlrKcjkSJZW8vz8ZhpN543NKilYVwtmkJrF9Mk0=' },
  },
};

export const ShortValue: Story = {
  args: {
    secret: { valueName: 'Example_Secret', value: 'ABCD1234' },
  },
};
