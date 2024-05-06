import { Meta, StoryObj } from '@storybook/react';

import CstgAddDomainDialog from './CstgAddDomainDialog';

const meta: Meta<typeof CstgAddDomainDialog> = {
  title: 'CSTG/Cstg Add Domain Dialog',
  component: CstgAddDomainDialog,
};
export default meta;

type Story = StoryObj<typeof CstgAddDomainDialog>;

export const Default: Story = {
  args: {
    onAddDomains: (newDomain) => Promise.resolve(console.log('New domain added: ', newDomain)),
  },
};
