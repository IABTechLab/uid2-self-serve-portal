import { Meta, StoryObj } from '@storybook/react';

import { UpdateDomainNamesResponse } from './CstgDomainHelper';
import { CstgDomainsTable } from './CstgDomainsTable';

const meta: Meta<typeof CstgDomainsTable> = {
  title: 'CSTG/Domains/Domains Table',
  component: CstgDomainsTable,
};

export default meta;
type Story = StoryObj<typeof CstgDomainsTable>;

export const WithDomains: Story = {
  args: {
    domains: ['test.com', 'abc.com', '123.com'],
    onUpdateDomains: (domains: string[]) => {
      console.log('update domains to:', domains);
      return Promise.resolve({ domains, isValidDomains: true });
    },
  },
};

export const WithoutDomains: Story = {
  args: {
    domains: [],
    onUpdateDomains: (domains: string[]) => {
      Promise.resolve(console.log('update domains to:', domains));
      return Promise.resolve({ domains: [''], isValidDomains: true });
    },
  },
};
