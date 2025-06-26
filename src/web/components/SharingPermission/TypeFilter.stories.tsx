import { Meta, StoryObj } from '@storybook/react-webpack5';

import { TypeFilter } from './TypeFilter';
import { ClientType } from '../../../api/services/adminServiceHelpers';

const meta: Meta<typeof TypeFilter> = {
  title: 'Sharing Permissions/Type Filter',
  component: TypeFilter,
};
export default meta;

type Story = StoryObj<typeof TypeFilter>;

export const Default = {
  args: {
    types: ['DSP', 'PUBLISHER', 'DATA_PROVIDER'] as ClientType[],
    onFilterChange: (selectedTypeIds: Set<ClientType>) => {
      console.log('Selected type IDs: ', Array.from(selectedTypeIds));
    },
    selectedTypeIds: new Set<ClientType>(),
  },
};
