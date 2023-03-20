import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Option, SelectInput } from './SelectInput';

export default {
  title: 'Inputs/Select',
  component: SelectInput,
} as ComponentMeta<typeof SelectInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: ComponentStory<typeof SelectInput> = (args) => {
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectInput control={control} {...args} inputName='select' />
      <button type='submit'>Submit</button>
    </form>
  );
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Select an option',
  options,
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  label: 'Select an option',
  options,
  rules: { required: 'This field is required' },
};
