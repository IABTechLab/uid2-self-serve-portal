import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
import { RadioInput } from './RadioInput';
import { Option } from './SelectInput';

export default {
  title: 'Inputs/Radio',
  component: RadioInput,
} as ComponentMeta<typeof RadioInput>;

const Template: ComponentStory<typeof RadioInput> = (args) => {
  return (
    <Form onSubmit={() => {}}>
      <RadioInput {...args} inputName='radio' />{' '}
    </Form>
  );
};

const options: Option<string>[] = [
  { optionLabel: 'Option 1', value: 'option1' },
  { optionLabel: 'Option 2', value: 'option2' },
  { optionLabel: 'Option 3', value: 'option3' },
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
