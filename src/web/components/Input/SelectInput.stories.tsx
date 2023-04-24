import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Form } from '../Core/Form';
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
  return (
    <Form onSubmit={() => {}}>
      <SelectInput {...args} inputName='select' />{' '}
    </Form>
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
