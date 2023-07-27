import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Collapsible } from './Collapsible';

export default {
  title: 'Shared Components/Collapsible',
  component: Collapsible,
} as ComponentMeta<typeof Collapsible>;

const Template: ComponentStory<typeof Collapsible> = (args) => <Collapsible {...args} />;

export const Open = Template.bind({});
Open.args = {
  title: 'Test Collapsible Title',
  content: 'Test Collapsible Content',
  defaultOpen: true,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  title: 'Test Collapsible Title',
  content: 'Test Collapsible Content',
  defaultOpen: false,
};
