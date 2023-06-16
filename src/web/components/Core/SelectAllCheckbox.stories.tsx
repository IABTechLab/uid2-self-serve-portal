import { CheckedState } from '@radix-ui/react-checkbox';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SelectAllCheckbox, SelectAllCheckboxState } from './SelectAllCheckbox';

export default {
  title: 'Shared Components/SelectAllCheckbox',
  component: SelectAllCheckbox,
} as ComponentMeta<typeof SelectAllCheckbox>;

const Template: ComponentStory<typeof SelectAllCheckbox> = (args) => (
  <SelectAllCheckbox {...args} />
);

export const Checked = Template.bind({});
Checked.args = {
  status: SelectAllCheckboxState.checked,
  onSelectAll: () => {
    console.log('Select all');
  },
  onUnselect: () => {
    console.log('Unselect all');
  },
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  status: SelectAllCheckboxState.indeterminate as CheckedState,
  onSelectAll: () => {
    console.log('Select all');
  },
  onUnselect: () => {
    console.log('Unselect all');
  },
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  status: SelectAllCheckboxState.unchecked,
  onSelectAll: () => {
    console.log('Select all');
  },
  onUnselect: () => {
    console.log('Unselect all');
  },
};
