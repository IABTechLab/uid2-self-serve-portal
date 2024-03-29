import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
import { TextInput } from './TextInput';

export default {
  title: 'Inputs/Text',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => {
  return (
    <Form onSubmit={() => {}}>
      <TextInput {...args} inputName='textInput' data-testid='text-input' />
    </Form>
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
