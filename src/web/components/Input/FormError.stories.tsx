import { Meta, StoryObj } from '@storybook/react-webpack5';

import { FormError } from './FormError';

const meta: Meta<typeof FormError> = {
  title: 'Shared Components/Inputs/Form Error',
  component: FormError,
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const ErrorExample: Story = {
  render: (args) => (
    <FormError {...args}>Some error text that should be shown to the user.</FormError>
  ),

  args: { display: true },
};
