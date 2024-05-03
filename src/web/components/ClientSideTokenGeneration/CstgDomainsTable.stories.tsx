import { Meta, StoryObj } from '@storybook/react';

import { CstgDomainsTable } from './CstgDomainsTable';

export default {
  title: 'CSTG/Domains/Domains Table',
  component: CstgDomainsTable,
} as Meta<typeof CstgDomainsTable>;

type Story = StoryObj<typeof CstgDomainsTable>;

export const WithDomains: Story = {
  args: {
    domains: ['test.com', 'abc.com', '123.com'],
    onUpdateDomains: (domains) => Promise.resolve(console.log('update domains to:', domains)),
  },
};

export const WithoutDomains: Story = {
  args: {
    domains: [],
    onUpdateDomains: (domains) => Promise.resolve(console.log('update domains to:', domains)),
  },
};
