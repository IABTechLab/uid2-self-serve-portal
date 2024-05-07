import { Meta, StoryObj } from '@storybook/react';

import { TableNoDataPlaceholder } from './TableNoDataPlaceholder';

export default {
  component: TableNoDataPlaceholder,
  title: 'Shared Components/ Table No Data Placeholder',
} as Meta<typeof TableNoDataPlaceholder>;

type Story = StoryObj<typeof TableNoDataPlaceholder>;

export const Default: Story = {
  args: {
    icon: <img src='/group-icon.svg' alt='group-icon' />,
    title: 'No Data',
    children: <span>No data in table</span>,
  },
};
