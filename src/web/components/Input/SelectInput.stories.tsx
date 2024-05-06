import { Meta, StoryFn } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/FormSubmitButton';
import { Option, SelectInput } from './SelectInput';

export default {
  title: 'Inputs/Select',
  component: SelectInput,
} as Meta<typeof SelectInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: StoryFn<typeof SelectInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})}>
        <SelectInput {...args} inputName='select' /> <FormSubmitButton />
      </form>
    </FormProvider>
  );
};

export const WithLabel = {
  render: Template,

  args: {
    label: 'Select an option',
    options,
  },
};

export const WithValidation = {
  render: Template,

  args: {
    label: 'Select an option',
    options,
    rules: { required: 'This field is required' },
  },
};
