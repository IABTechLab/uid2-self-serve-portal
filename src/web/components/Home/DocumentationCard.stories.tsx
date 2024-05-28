import { Meta, StoryObj } from '@storybook/react';

import DocumentationCard from './DocumentationCard';

const meta: Meta<typeof DocumentationCard> = {
  title: 'Home/Documentation Card',
  component: DocumentationCard,
};

export default meta;

type Story = StoryObj<typeof DocumentationCard>;

export const Default: Story = {
  render: () => <DocumentationCard />,
};
