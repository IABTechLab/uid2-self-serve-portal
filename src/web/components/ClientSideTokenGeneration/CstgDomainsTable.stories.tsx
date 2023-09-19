import { Meta, Story } from '@storybook/react';

import { CstgDomainsTable, CstgDomainsTableProps } from './CstgDomainsTable';

export default {
  title: 'CSTG/CstgDomainsTable',
  component: CstgDomainsTable,
} as Meta<typeof CstgDomainsTable>;

const Template: Story<CstgDomainsTableProps> = (args) => <CstgDomainsTable {...args} />;

export const WithDomains = Template.bind({});

WithDomains.args = {
  domains: ['test.com', 'abc.com', '123.com'],
  onUpdateDomains: (domains) => Promise.resolve(console.log('update domains to:', domains)),
};

export const WithoutDomains = Template.bind({});

WithoutDomains.args = {
  domains: [],
  onUpdateDomains: (domains) => Promise.resolve(console.log('update domains to:', domains)),
};
