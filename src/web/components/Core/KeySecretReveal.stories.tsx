import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import KeySecretReveal from './KeySecretReveal';

const meta: Meta<typeof KeySecretReveal> = {
  component: KeySecretReveal,
  title: 'Shared Components/Key Secret Reveal',
};
export default meta;

type Story = StoryObj<typeof KeySecretReveal>;

export const LongValue: Story = {
  args: {
    title: 'Example_Secret',
    value: '6XlnVlrKcjkSJZW8vz8ZhpN543NKilYVwtmkJrF9Mk0=',
  },
};

export const ShortValue: Story = {
  args: {
    title: 'Example_Secret',
    value: 'ABCD1234',
  },
};
