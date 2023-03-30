import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { TextInput } from './TextInput';

export default {
  title: 'Inputs/Text',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput control={control} {...args} inputName='textInput' data-testid='text-input' />{' '}
      <button type='submit'>Submit</button>
    </form>
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
