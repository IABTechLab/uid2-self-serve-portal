/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';

import DisplaySecret from './DisplaySecret';

const meta: Meta<typeof DisplaySecret> = {
  component: DisplaySecret,
  title: 'Shared Components/Display Secret',
  decorators: [
    (Story) => (
      <div style={{ width: '250px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DisplaySecret>;

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
