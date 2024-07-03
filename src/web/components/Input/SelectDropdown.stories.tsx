import { Meta, StoryObj } from '@storybook/react';

import { SelectDropdown } from './SelectDropdown';

const meta: Meta<typeof SelectDropdown> = {
  title: 'Shared Components/Inputs/Select Dropdown',
  component: SelectDropdown,
};

export default meta;
type Story = StoryObj<typeof SelectDropdown>;

export const Default: Story = {
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

export const WithInitialValue: Story = {
  args: {
    title: 'Rows Per Page',
    options: [
      {
        name: '10',
        id: 10,
      },
      {
        name: '25',
        id: 25,
      },
      {
        name: '50',
        id: 50,
      },
      {
        name: '100',
        id: 100,
      },
    ],
    initialValue: {
      name: '10',
      id: 10,
    },
    onSelectedChange: (ids) => console.log('Selected:', ids),
  },
};
