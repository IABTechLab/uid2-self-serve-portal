import { Meta } from '@storybook/react';

import { MultiSelectDropdown } from './MultiSelectDropdown';

export default {
  title: 'Shared Components/Multi-Select Dropdown',
  component: MultiSelectDropdown,
} as Meta<typeof MultiSelectDropdown>;

export const Default = {
  args: {
    title: 'Participant Types',
    options: [
      {
        name: 'Type 1',
        id: 1,
      },
      {
        name: 'Type 2',
        id: 2,
      },
      {
        name: 'Type 3',
        id: 3,
      },
      {
        name: 'Type 4',
        id: 4,
      },
    ],
    onSelectedChange: (ids) => console.log('Selected:', ids),
  },
};
