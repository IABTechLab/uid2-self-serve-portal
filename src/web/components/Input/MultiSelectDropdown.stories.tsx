import { Meta, StoryObj } from '@storybook/react-webpack5';

import { MultiSelectDropdown } from './MultiSelectDropdown';

const meta: Meta<typeof MultiSelectDropdown> = {
  title: 'Shared Components/Inputs/Multi-Select Dropdown',
  component: MultiSelectDropdown,
};

export default meta;
type Story = StoryObj<typeof MultiSelectDropdown>;

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
