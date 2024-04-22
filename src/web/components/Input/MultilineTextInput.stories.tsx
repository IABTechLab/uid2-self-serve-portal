import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
import { MultilineTextInput } from './MultilineTextInput';

export default {
  title: 'Inputs/MultilineText',
  component: MultilineTextInput,
} as ComponentMeta<typeof MultilineTextInput>;

const Template: ComponentStory<typeof MultilineTextInput> = (args) => {
  return (
    <Form
      onSubmit={(formData) => {
        console.log(formData);
      }}
    >
      <MultilineTextInput
        {...args}
        inputName='multilineTextInput'
        data-testid='multiline-text-input'
      />
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
  rules: { required: 'Please enter some text.' },
};
