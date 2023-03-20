import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { RadioInput } from './RadioInput';
import { Option } from './SelectInput';

export default {
  title: 'Inputs/Radio',
  component: RadioInput,
} as ComponentMeta<typeof RadioInput>;

const Template: ComponentStory<typeof RadioInput> = (args) => {
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioInput control={control} {...args} name='radio' /> <button type='submit'>Submit</button>
    </form>
  );
};

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

export const WithLabel = Template.bind({});
WithLabel.args = {
  name: 'default radio',
  label: 'Select an option',
  options,
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  name: 'checkbox with rule',
  label: 'Select options',
  options,
  rules: { required: 'This field is required' },
};
