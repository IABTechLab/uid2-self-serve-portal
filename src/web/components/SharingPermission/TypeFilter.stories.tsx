import { Meta } from '@storybook/react-webpack5';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import { TypeFilter } from './TypeFilter';

const meta: Meta<typeof TypeFilter> = {
  title: 'Sharing Permissions/Type Filter',
  component: TypeFilter,
};
export default meta;

export const Default = {
  args: {
    types: ['DSP', 'PUBLISHER', 'DATA_PROVIDER'] as ClientType[],
    onFilterChange: (selectedTypeIds: Set<ClientType>) => {
      console.log('Selected type IDs: ', Array.from(selectedTypeIds));
    },
    selectedTypeIds: new Set<ClientType>(),
  },
};
