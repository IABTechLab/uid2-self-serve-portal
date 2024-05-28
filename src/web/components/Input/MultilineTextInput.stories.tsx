import { Meta, StoryFn } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/FormSubmitButton';
import { MultilineTextInput } from './MultilineTextInput';

export default {
  title: 'Shared Components/Inputs/MultilineText',
  component: MultilineTextInput,
} as Meta<typeof MultilineTextInput>;

const Template: StoryFn<typeof MultilineTextInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit((formData) => {
          console.log(formData);
        })}
      >
        <MultilineTextInput
          {...args}
          inputName='multilineTextInput'
          data-testid='multiline-text-input'
        />
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
    rules: { required: 'Please enter some text.' },
  },
};
