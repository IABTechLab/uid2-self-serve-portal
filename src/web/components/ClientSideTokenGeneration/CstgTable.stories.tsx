import { Meta, StoryObj } from '@storybook/react';

import { CstgTable } from './CstgTable';

const meta: Meta<typeof CstgTable> = {
  title: 'CSTG/Domains/Domains Table',
  component: CstgTable,
};

export default meta;
type Story = StoryObj<typeof CstgTable>;

export const WithDomains: Story = {
  args: {
    cstgValues: ['test.com', 'abc.com', '123.com'],
    onUpdateCstgValues: (cstgValues: string[]) => {
      console.log('update domains to:', cstgValues);
      return Promise.resolve({ cstgValues, isValidCstgValues: true });
    },
  },
};
export const WithoutDomains: Story = {
  args: {
    cstgValues: [],
    onUpdateCstgValues: (cstgValues: string[]) => {
      console.log('update domains to:', cstgValues);
      return Promise.resolve({ cstgValues, isValidCstgValues: true });
    },
  },
};

export const WithMobileAppIds: Story = {
  args: {
    cstgValues: ['com.test.com', '123456'],
    onUpdateCstgValues: (cstgValues: string[]) => {
      console.log('update mobile app ids to:', cstgValues);
      return Promise.resolve({ cstgValues, isValidCstgValues: true });
    },
  },
};

export const WithoutMobileAppIds: Story = {
  args: {
    cstgValues: [],
    onUpdateCstgValues: (cstgValues: string[]) => {
      console.log('update mobile app ids to:', cstgValues);
      return Promise.resolve({ cstgValues, isValidCstgValues: true });
    },
  },
};
