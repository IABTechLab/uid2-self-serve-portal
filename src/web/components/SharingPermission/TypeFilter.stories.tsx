import { Meta } from '@storybook/react';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import { TypeFilter } from './TypeFilter';

export default {
  title: 'Sharing Permissions/Type Filter',
  component: TypeFilter,
} as Meta<typeof TypeFilter>;

export const Default = {
  args: {
    types: ['DSP', 'PUBLISHER', 'DATA_PROVIDER'],
    onFilterChange: (selectedTypeIds: Set<ClientType>) => {
      console.log('Selected type IDs: ', Array.from(selectedTypeIds));
    },
    selectedTypeIds: new Set(),
  },
};
