import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ClientType } from '../../../api/services/adminServiceHelpers';
import { TypeFilter } from './TypeFilter';

export default {
  title: 'Sharing Permissions/TypeFilter',
  component: TypeFilter,
} as ComponentMeta<typeof TypeFilter>;

const Template: ComponentStory<typeof TypeFilter> = (args) => <TypeFilter {...args} />;

export const Default = Template.bind({});

Default.args = {
  types: ['DSP', 'PUBLISHER', 'DATA_PROVIDER'],
  onFilterChange: (selectedTypeIds: Set<ClientType>) => {
    console.log('Selected type IDs: ', Array.from(selectedTypeIds));
  },
  selectedTypeIds: new Set(),
};
