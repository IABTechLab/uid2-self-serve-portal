import { Meta, StoryObj } from '@storybook/react';

import { CstgDomainInputRow } from './CstgDomainInputRow';

const meta: Meta<typeof CstgDomainInputRow> = {
  title: 'CSTG/CstgDomainInputRow',
  component: CstgDomainInputRow,
  decorators: [
    (Story) => (
      <table className='cstg-domains-table '>
        <thead>
          <tr>
            <th> </th>
            <th className='domain'>Domain</th>
            <th className='action'>Actions</th>
          </tr>
        </thead>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

type Story = StoryObj<typeof CstgDomainInputRow>;

export const Default: Story = {
  args: {
    onAdd: (newDomain) => Promise.resolve(console.log('New domain added: ', newDomain)),
    onCancel: () => console.log('cancel clicked'),
  },
};

export default meta;
