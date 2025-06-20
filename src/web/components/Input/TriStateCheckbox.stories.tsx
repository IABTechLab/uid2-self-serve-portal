import { CheckedState } from '@radix-ui/react-checkbox';
import { Meta, StoryObj } from '@storybook/react-webpack5';

import { TriStateCheckbox, TriStateCheckboxState } from './TriStateCheckbox';

const meta: Meta<typeof TriStateCheckbox> = {
  title: 'Shared Components/Inputs/TriState Checkbox',
  component: TriStateCheckbox,
};

export default meta;
type Story = StoryObj<typeof TriStateCheckbox>;

export const Checked: Story = {
  args: {
    status: TriStateCheckboxState.checked,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Indeterminate: Story = {
  args: {
    status: TriStateCheckboxState.indeterminate as CheckedState,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Unchecked: Story = {
  args: {
    status: TriStateCheckboxState.unchecked,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Disabled: Story = {
  args: {
    status: TriStateCheckboxState.unchecked,
    onClick: () => {
      console.log('checkbox clicked');
    },
    disabled: true,
  },
};
