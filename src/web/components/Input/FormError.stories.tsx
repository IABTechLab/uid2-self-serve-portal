import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FormError } from './FormError';

export default {
  title: 'Inputs/FormError',
  component: FormError,
} as ComponentMeta<typeof FormError>;

export const ErrorExample: ComponentStory<typeof FormError> = (args) => (
  <FormError {...args}>Some error text that should be shown to the user.</FormError>
);
ErrorExample.args = { display: true };
