import { Meta, StoryFn, StoryObj } from '@storybook/react-webpack5';
import { FormProvider, useForm } from 'react-hook-form';

import FormSubmitButton from '../Core/Buttons/FormSubmitButton';
import { MultilineTextInput } from './MultilineTextInput';

const meta: Meta<typeof MultilineTextInput> = {
  title: 'Shared Components/Inputs/MultilineText',
  component: MultilineTextInput,
};

export default meta;
type Story = StoryObj<typeof MultilineTextInput>;

export const CreateStory = (story: { render: Function; args: {} }) => {
  return () => story.render(story.args);
};

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
    rules: { required: 'Please enter some text.' },
  },
};
