import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PagingTool } from './PagingTool';

import '../ClientSideTokenGeneration/CstgDomainsTable.scss';

export default {
  title: 'Shared Components/PagingTool',
  component: PagingTool,
} as ComponentMeta<typeof PagingTool>;

const Template: ComponentStory<typeof PagingTool> = (args) => <PagingTool {...args} />;

export const Default = Template.bind({});
Default.args = {
  rowsPerPageTitle: 'Domains Per Page',
  totalRows: ['test.com'],
  initialRowsPerPage: 10,
};
