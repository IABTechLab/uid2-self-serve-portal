import { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { Option, SelectInput } from './SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Shared Components/Inputs/Select',
  component: SelectInput,
};

export const CreateStory = (story: { render: Function; args: {} }) => {
  return () => story.render(story.args);
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

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

export const WithLabel: Story = {
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
