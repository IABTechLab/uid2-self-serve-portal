import { Meta, StoryObj } from '@storybook/react';

import CstgDeleteDomainDialog from './CstgDeleteDomainDialog';

const meta: Meta<typeof CstgDeleteDomainDialog> = {
  title: 'CSTG/Cstg Delete Domain Dialog',
  component: CstgDeleteDomainDialog,
};
export default meta;

type Story = StoryObj<typeof CstgDeleteDomainDialog>;

export const Default: Story = {
  args: {
    domains: ['testdomain.com'],
  },
};
