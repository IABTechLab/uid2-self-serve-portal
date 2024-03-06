import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
import { MultiCheckboxInput } from './MultiCheckboxInput';
import { Option } from './SelectInput';

export default {
  title: 'Inputs/Checkbox',
  component: MultiCheckboxInput,
} as ComponentMeta<typeof MultiCheckboxInput>;

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
];

const Template: ComponentStory<typeof MultiCheckboxInput> = (args) => {
  return (
    <Form onSubmit={(formData) => console.log(formData)}>
      <MultiCheckboxInput {...args} inputName='checkbox' />
    </Form>
  );
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  inputName: 'default',
  label: 'Select options',
  options,
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  inputName: 'default',
  label: 'Select options',
  options: [
    { optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' },
    { optionLabel: 'Option 2', optionToolTip: 'Option2', value: 'option2' },
    { optionLabel: 'Option 3', optionToolTip: 'Option3', value: 'option3' },
  ],
};

export const OneOption = Template.bind({});
OneOption.args = {
  inputName: 'Checkbox with one option',
  label: 'Select option',
  options: [{ optionLabel: 'Option 1', optionToolTip: 'Option1', value: 'option1' }],
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
