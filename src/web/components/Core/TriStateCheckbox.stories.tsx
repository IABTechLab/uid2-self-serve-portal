import { CheckedState } from '@radix-ui/react-checkbox';
import { Meta } from '@storybook/react';

import { TriStateCheckbox, TriStateCheckboxState } from './TriStateCheckbox';

export default {
  title: 'Shared Components/Inputs/TriState Checkbox',
  component: TriStateCheckbox,
} as Meta<typeof TriStateCheckbox>;

export const Checked = {
  args: {
    status: TriStateCheckboxState.checked,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Indeterminate = {
  args: {
    status: TriStateCheckboxState.indeterminate as CheckedState,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Unchecked = {
  args: {
    status: TriStateCheckboxState.unchecked,
    onClick: () => {
      console.log('checkbox clicked');
    },
  },
};

export const Disabled = {
  args: {
    status: TriStateCheckboxState.unchecked,
    onClick: () => {
      console.log('checkbox clicked');
    },
    disabled: true,
  },
};
