import { Meta, StoryObj } from '@storybook/react-webpack5';

import DocumentationCard from './DocumentationCard';

const meta: Meta<typeof DocumentationCard> = {
  title: 'Home/Documentation Card',
  component: DocumentationCard,
};

export default meta;

type Story = StoryObj<typeof DocumentationCard>;

export const Default: Story = {
  args: {},
};
