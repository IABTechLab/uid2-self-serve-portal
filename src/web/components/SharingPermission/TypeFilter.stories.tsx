import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TypeFilter } from './TypeFilter';

export default {
  title: 'Sharing Permissions/TypeFilter',
  component: TypeFilter,
} as ComponentMeta<typeof TypeFilter>;

const Template: ComponentStory<typeof TypeFilter> = (args) => <TypeFilter {...args} />;

export const Default = Template.bind({});
Default.args = {
  types: [
    { id: 1, typeName: 'Type 1' },
    { id: 2, typeName: 'Type 2' },
    { id: 3, typeName: 'Type 3' },
  ],
  onFilterChange: (selectedTypeIds: Set<number>) => {
    console.log('Selected type IDs: ', Array.from(selectedTypeIds));
  },
};
