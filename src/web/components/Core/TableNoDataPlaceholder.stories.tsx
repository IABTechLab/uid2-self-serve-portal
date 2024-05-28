import { Meta, StoryObj } from '@storybook/react';

import { TableNoDataPlaceholder } from './TableNoDataPlaceholder';

const meta: Meta<typeof TableNoDataPlaceholder> = {
  title: 'Shared Components/ Table No Data Placeholder',
  component: TableNoDataPlaceholder,
};

export default meta;
type Story = StoryObj<typeof TableNoDataPlaceholder>;

export const Default: Story = {
  args: {
    icon: <img src='/group-icon.svg' alt='group-icon' />,
    title: 'No Data',
    children: <span>No data in table</span>,
  },
};
