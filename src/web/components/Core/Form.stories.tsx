import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CheckboxInput } from '../Input/CheckboxInput';
import { RadioInput } from '../Input/RadioInput';
import { SelectInput } from '../Input/SelectInput';
import { TextInput } from '../Input/TextInput';
import { Form } from './Form';

export default {
  title: 'Shared Components/Form',
  component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const WithInputFields = Template.bind({});
WithInputFields.args = {
  onSubmit: () => {},
  children: [
    <TextInput
      name='textInput'
      key='textInput'
      label='Text Input'
      control={undefined}
      data-testid='text-input'
    />,
    <SelectInput
      control={undefined}
      key='SelectInput'
      name='selectInputValue'
      label='Select Input'
      options={[
        {
          optionLabel: 'Option 1',
          value: '1',
        },
        {
          optionLabel: 'Option 2',
          value: '2',
        },
      ]}
    />,
    <RadioInput
      control={undefined}
      key='radioInput'
      name='radioInputValue'
      label='Radio Input '
      options={[
        {
          optionLabel: 'Yes',
          value: 1,
        },
        {
          optionLabel: 'No',
          value: 0,
        },
      ]}
    />,
    <CheckboxInput
      key='checkboxInput'
      control={undefined}
      name='checkboxInputValue'
      label='checkbox Input '
      options={[
        {
          optionLabel: 'Checkbox 1',
          value: '1',
        },
        {
          optionLabel: 'Checkbox 2',
          value: '2',
        },
      ]}
    />,
  ],
};

export const SubmitWithError = Template.bind({});
SubmitWithError.args = {
  onSubmit: () => {
    throw new Error('Here is an error');
  },
  children: [<TextInput name='textInput' key='textInput' label='Text Input' control={undefined} />],
};

export const WithDefaultData = Template.bind({});
WithDefaultData.args = {
  onSubmit: () => {},
  children: [
    <TextInput name='textInput' key='textInput' label='Text Input' control={undefined} />,
    <SelectInput
      control={undefined}
      key='SelectInput'
      name='selectInputValue'
      label='Select Input'
      options={[
        {
          optionLabel: 'Option 1',
          value: '1',
        },
        {
          optionLabel: 'Option 2',
          value: '2',
        },
      ]}
    />,
    <RadioInput
      control={undefined}
      key='radioInput'
      name='radioInputValue'
      label='Radio Input '
      options={[
        {
          optionLabel: 'Yes',
          value: 1,
        },
        {
          optionLabel: 'No',
          value: 0,
        },
      ]}
    />,
    <CheckboxInput
      key='checkboxInput'
      control={undefined}
      name='checkboxInputValue'
      label='checkbox Input '
      options={[
        {
          optionLabel: 'Checkbox 1',
          value: '1',
        },
        {
          optionLabel: 'Checkbox 2',
          value: '2',
        },
      ]}
    />,
  ],
  defaultValues: {
    textInput: 'Some default value',
  },
};

export const WithSubmitButtonText = Template.bind({});
WithSubmitButtonText.args = {
  onSubmit: () => {},
  children: [<TextInput name='textInput' key='textInput' label='Text Input' control={undefined} />],
  submitButtonText: 'Create',
};
