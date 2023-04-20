import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
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
  return (
    <Form onSubmit={() => {}}>
      <CheckboxInput {...args} inputName='checkbox' />{' '}
    </Form>
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

export const BooleanCheckbox = Template.bind({});
BooleanCheckbox.args = {
  inputName: 'boolean checkbox',
  options: [
    {
      optionLabel: 'Tick to accept the term',
      value: true,
    },
  ],
};
