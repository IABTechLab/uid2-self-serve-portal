import { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { RadioInput } from './RadioInput';
import { Option } from './SelectInput';

const meta: Meta<typeof RadioInput> = {
  title: 'Shared Components/Inputs/Radio',
  component: RadioInput,
};

export default meta;

const Template: StoryFn<typeof RadioInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})}>
        <RadioInput {...args} inputName='radio' /> <FormSubmitButton />
      </form>
    </FormProvider>
  );
};

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
  { optionLabel: 'Option 4', value: 'option4', disabled: true },
];

export const WithLabel = {
  render: Template,

  args: {
    inputName: 'default radio',
    label: 'Select an option',
    options,
  },
};

export const WithValidation = {
  render: Template,

  args: {
    inputName: 'checkbox with rule',
    label: 'Select options',
    options,
    rules: { required: 'This field is required' },
  },
};
