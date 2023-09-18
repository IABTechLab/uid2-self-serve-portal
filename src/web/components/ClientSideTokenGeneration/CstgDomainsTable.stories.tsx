import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CstgDomainsTable } from './CstgDomainsTable';

export default {
  title: 'CSTG/CstgDomainsTable',
  component: CstgDomainsTable,
} as ComponentMeta<typeof CstgDomainsTable>;

const Template: ComponentStory<typeof CstgDomainsTable> = (args) => <CstgDomainsTable {...args} />;

export const CstgDomains = Template.bind({});

CstgDomains.args = {
  domains: ['test.com', 'abc.com', '123.com'],
  onUpdateDomains: (domains) => Promise.resolve(console.log('update domains to:', domains)),
};
