import { CheckedState } from '@radix-ui/react-checkbox';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TriStateCheckbox, TriStateCheckboxState } from './TriStateCheckbox';

export default {
  title: 'Shared Components/TriState Checkbox',
  component: TriStateCheckbox,
} as ComponentMeta<typeof TriStateCheckbox>;

const Template: ComponentStory<typeof TriStateCheckbox> = (args) => <TriStateCheckbox {...args} />;

export const Checked = Template.bind({});
Checked.args = {
  status: TriStateCheckboxState.checked,
  onClick: () => {
    console.log('checkbox clicked');
  },
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  status: TriStateCheckboxState.indeterminate as CheckedState,
  onClick: () => {
    console.log('checkbox clicked');
  },
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  status: TriStateCheckboxState.unchecked,
  onClick: () => {
    console.log('checkbox clicked');
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  status: TriStateCheckboxState.unchecked,
  onClick: () => {
    console.log('checkbox clicked');
  },
  disabled: true,
};
