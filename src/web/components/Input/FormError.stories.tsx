import { Meta, StoryObj } from '@storybook/react';

import { FormError } from './FormError';

export default {
  title: 'Inputs/FormError',
  component: FormError,
} as Meta<typeof FormError>;

export const ErrorExample: StoryObj<typeof FormError> = {
  render: (args) => (
    <FormError {...args}>Some error text that should be shown to the user.</FormError>
  ),

  args: { display: true },
};
