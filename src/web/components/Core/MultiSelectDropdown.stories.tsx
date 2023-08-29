import { ComponentMeta, ComponentStory } from '@storybook/react';

import { MultiSelectDropdown } from './MultiSelectDropdown';

export default {
  title: 'Shared Components/Multi-Select Dropdown',
  component: MultiSelectDropdown,
} as ComponentMeta<typeof MultiSelectDropdown>;

const Template: ComponentStory<typeof MultiSelectDropdown> = (args) => (
  <MultiSelectDropdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
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
};
