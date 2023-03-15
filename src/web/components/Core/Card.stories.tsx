import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Card } from './Card';

export default {
  title: 'Shared Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: 'Card Title',
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  title: 'Title',
  description: 'Here is the description',
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  children: 'test',
};
