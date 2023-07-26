import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Accordion } from './Accordion';

export default {
  title: 'Shared Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => <Accordion {...args} />;

export const Expanded = Template.bind({});
Expanded.args = {
  title: 'Test Accordion Title',
  content: 'Test Accordion Content',
  defaultExpanded: true,
  isCollapsible: true,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  title: 'Test Accordion Title',
  content: 'Test Accordion Content',
  defaultExpanded: false,
  isCollapsible: true,
};

export const NotCollapsible = Template.bind({});
NotCollapsible.args = {
  title: 'Test Accordion Title',
  content: 'Test Accordion Content',
  defaultExpanded: true,
  isCollapsible: false,
};

export const NotCollapsibleWithLabel = Template.bind({});
NotCollapsibleWithLabel.args = {
  title: 'Test Accordion Title',
  content: 'Test Accordion Content',
  defaultExpanded: true,
  isCollapsible: false,
  label: 'TEST LABEL',
};
