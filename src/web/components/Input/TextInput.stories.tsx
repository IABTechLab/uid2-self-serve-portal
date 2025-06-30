import { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { TextInput } from './TextInput';
import { CreateStory } from '../../../testHelpers/storybookHelpers';

const meta: Meta<typeof TextInput> = {
  title: 'Shared Components/Inputs/Text',
  component: TextInput,
};

export default meta;
type Story = StoryObj<typeof TextInput>;

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

export const WithLabel: Story = {
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

export const WithValidationStory = CreateStory(WithValidation);