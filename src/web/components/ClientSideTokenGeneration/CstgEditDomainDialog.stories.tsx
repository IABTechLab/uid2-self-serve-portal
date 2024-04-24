import { Meta, StoryObj } from '@storybook/react';

import CstgEditDomainDialog from './CstgEditDomainDialog';

const meta: Meta<typeof CstgEditDomainDialog> = {
  title: 'CSTG/CstgEditDomainDialog',
  component: CstgEditDomainDialog,
};
export default meta;

type Story = StoryObj<typeof CstgEditDomainDialog>;

export const Default: Story = {
  args: {
    domain: 'testdomain.com',
    existingDomains: ['test.com', 'test2.com'],
    onEditDomainName: (updatedDomain) =>
      Promise.resolve(console.log('New domain added: ', updatedDomain)),
  },
};
