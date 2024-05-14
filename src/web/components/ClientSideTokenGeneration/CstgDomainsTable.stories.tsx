import { Meta, StoryObj } from '@storybook/react';

import { UpdateDomainNamesResponse } from './CstgDomainHelper';
import { CstgDomainsTable } from './CstgDomainsTable';

export default {
  title: 'CSTG/Domains/Domains Table',
  component: CstgDomainsTable,
} as Meta<typeof CstgDomainsTable>;

type Story = StoryObj<typeof CstgDomainsTable>;

export const WithDomains: Story = {
  args: {
    domains: ['test.com', 'abc.com', '123.com'],
    onUpdateDomains: (domains: string[]) => {
      Promise.resolve(console.log('update domains to:', domains));
      return new Promise<UpdateDomainNamesResponse | undefined>((resolve) => {
        resolve({ domains, isValidDomains: true });
      });
    },
  },
};

export const WithoutDomains: Story = {
  args: {
    domains: [],
    onUpdateDomains: (domains: string[]) => {
      Promise.resolve(console.log('update domains to:', domains));
      return new Promise<UpdateDomainNamesResponse | undefined>((resolve) => {
        resolve({ domains: [''], isValidDomains: true });
      });
    },
  },
};
