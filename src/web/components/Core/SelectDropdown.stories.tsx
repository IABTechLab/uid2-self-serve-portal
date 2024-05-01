import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SelectDropdown } from './SelectDropdown';

export default {
  title: 'Shared Components/Select Dropdown',
  component: SelectDropdown,
} as ComponentMeta<typeof SelectDropdown>;

const Template: ComponentStory<typeof SelectDropdown> = (args) => <SelectDropdown {...args} />;

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

export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
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
};
