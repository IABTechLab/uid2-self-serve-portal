import { Meta, StoryObj } from '@storybook/react';

import CstgDeleteDomainConfirmationDialog from './CstgDeleteDomainDialog';

const meta: Meta<typeof CstgDeleteDomainConfirmationDialog> = {
  title: 'CSTG/CstgDeleteDomainConfirmationDialog',
  component: CstgDeleteDomainConfirmationDialog,
};
export default meta;

type Story = StoryObj<typeof CstgDeleteDomainConfirmationDialog>;

export const Default: Story = {
  args: {
    domain: 'testdomain.com',
  },
};
