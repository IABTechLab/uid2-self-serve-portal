import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { TextInput } from './TextInput';

import '../../styles/forms.scss';

export default {
  title: 'Inputs/Text',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})}>
        <TextInput {...args} inputName='textInput' data-testid='text-input' />
        <div className='form-footer'>
          <button type='submit' className='primary-button'>
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  name: 'default',
  label: 'Enter text',
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  name: 'text with rule',
  label: 'Enter text',
  rules: { maxLength: { value: 2, message: 'Too many characters' } },
};
