import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { RadioInput } from './RadioInput';
import { Option } from './SelectInput';

import '../Core/Form.scss';

export default {
  title: 'Inputs/Radio',
  component: RadioInput,
} as ComponentMeta<typeof RadioInput>;

const Template: ComponentStory<typeof RadioInput> = (args) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})}>
        <RadioInput {...args} inputName='radio' />{' '}
        <div className='form-footer'>
          <button type='submit' className='primary-button'>
            Submit
          </button>
        </div>
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

export const WithLabel = Template.bind({});
WithLabel.args = {
  inputName: 'default radio',
  label: 'Select an option',
  options,
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  inputName: 'checkbox with rule',
  label: 'Select options',
  options,
  rules: { required: 'This field is required' },
};
