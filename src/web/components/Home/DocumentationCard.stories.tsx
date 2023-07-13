import { ComponentMeta, ComponentStory } from '@storybook/react';

import DocumentationCard from './DocumentationCard';

export default {
  title: 'Home/Documentation Card',
  component: DocumentationCard,
} as ComponentMeta<typeof DocumentationCard>;
const Template: ComponentStory<typeof DocumentationCard> = () => {
  return <DocumentationCard />;
};

export const Default = Template.bind({});
