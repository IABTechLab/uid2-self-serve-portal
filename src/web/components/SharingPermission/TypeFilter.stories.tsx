import { Meta, StoryObj } from '@storybook/react-webpack5';

import { TypeFilter } from './TypeFilter';

const meta: Meta<typeof TypeFilter> = {
  title: 'Sharing Permissions/Type Filter',
  component: TypeFilter,
};
export default meta;

type Story = StoryObj<typeof TypeFilter>;

export const Default: Story = {
  args: {
    types: ['DSP', 'PUBLISHER', 'DATA_PROVIDER'],
    onFilterChange: (selectedTypeIds) => {
      console.log('Selected type IDs: ', Array.from(selectedTypeIds));
    },
    selectedTypeIds: new Set(),
  },
};
