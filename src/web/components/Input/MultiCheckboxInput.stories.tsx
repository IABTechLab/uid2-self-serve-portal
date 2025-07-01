import { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { FormProvider, useForm } from 'react-hook-form';

import { CreateStory } from '../../../testHelpers/storybookHelpers';
import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { MultiCheckboxInput } from './MultiCheckboxInput';
import { Option } from './SelectInput';

const meta: Meta<typeof MultiCheckboxInput> = {
  title: 'Shared Components/Inputs/Checkbox',
  component: MultiCheckboxInput,
};

export default meta;
type Story = StoryObj<typeof MultiCheckboxInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: StoryFn<typeof MultiCheckboxInput> = (args) => {
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

export const WithLabel: Story = {
  render: Template,

  args: {
    inputName: 'default',
    label: 'Select options',
    options,
  },
};

export const WithToolTip: Story = {
  render: Template,

  args: {
    inputName: 'default',
    label: 'Select options',
    options: [
      { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
      { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
      { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
    ],
  },
};

export const OneOption: Story = {
  render: Template,

  args: {
    inputName: 'Checkbox with one option',
    label: 'Select option',
    options: [{ optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' }],
  },
};

export const WithValidation = {
  render: Template,

  args: {
    inputName: 'checkbox with rule',
    label: 'Select options',
    options,
    rules: {
      validate: (value: string[]) => (value && value.length > 1) || 'At least two options are required',
    },
  },
};

export const WithValidationStory = CreateStory(WithValidation);
