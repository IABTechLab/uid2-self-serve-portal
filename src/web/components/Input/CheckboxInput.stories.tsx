import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { CheckboxInput } from './CheckboxInput';
import { Option } from './SelectInput';

export default {
  title: 'Inputs/Checkbox',
  component: CheckboxInput,
} as ComponentMeta<typeof CheckboxInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: ComponentStory<typeof CheckboxInput> = (args) => {
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CheckboxInput control={control} {...args} inputName='checkbox' />{' '}
      <button type='submit'>Submit</button>
    </form>
  );
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  inputName: 'default',
  label: 'Select options',
  options,
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
