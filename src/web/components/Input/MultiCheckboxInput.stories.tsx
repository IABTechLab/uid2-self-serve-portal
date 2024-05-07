import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/FormSubmitButton';
import { MultiCheckboxInput } from './MultiCheckboxInput';
import { Option } from './SelectInput';

export default {
  title: 'Shared Components/Inputs/Checkbox',
  component: MultiCheckboxInput,
} as ComponentMeta<typeof MultiCheckboxInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: ComponentStory<typeof MultiCheckboxInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit((formData) => console.log(formData))}>
        <MultiCheckboxInput {...args} inputName='checkbox' />
        <FormSubmitButton />
      </form>
    </FormProvider>
  );
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  inputName: 'default',
  label: 'Select options',
  options,
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  inputName: 'default',
  label: 'Select options',
  options: [
    { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
    { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
    { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
  ],
};

export const OneOption = Template.bind({});
OneOption.args = {
  inputName: 'Checkbox with one option',
  label: 'Select option',
  options: [{ optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' }],
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  inputName: 'checkbox with rule',
  label: 'Select options',
  options,
  rules: {
    validate: (value) => (value && value.length > 1) || 'At least two options are required',
  },
};
