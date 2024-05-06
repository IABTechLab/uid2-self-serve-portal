import { Meta, StoryFn } from '@storybook/react';

import DocumentationCard from './DocumentationCard';

export default {
  title: 'Home/Documentation Card',
  component: DocumentationCard,
} as Meta<typeof DocumentationCard>;
const Template: StoryFn<typeof DocumentationCard> = () => {
  return <DocumentationCard />;
};

export const Default = {
  render: Template,
};
