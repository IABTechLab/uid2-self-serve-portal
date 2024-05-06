import { Meta, StoryFn } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/FormSubmitButton';
import { TextInput } from './TextInput';

export default {
  title: 'Inputs/Text',
  component: TextInput,
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})}>
        <TextInput {...args} inputName='textInput' data-testid='text-input' />
        <FormSubmitButton />
      </form>
    </FormProvider>
  );
};

export const WithLabel = {
  render: Template,

  args: {
    name: 'default',
    label: 'Enter text',
  },
};

export const WithValidation = {
  render: Template,

  args: {
    name: 'text with rule',
    label: 'Enter text',
    rules: { maxLength: { value: 2, message: 'Too many characters' } },
  },
};
