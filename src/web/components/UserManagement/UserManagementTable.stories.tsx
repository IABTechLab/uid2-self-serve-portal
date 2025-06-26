import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { UserJobFunction } from '../../../api/entities/User';
import UserManagementTable from './UserManagementTable';

const meta: Meta<typeof UserManagementTable> = {
  component: UserManagementTable,
  title: 'Manage Users/All Users Table',
};
export default meta;

type Story = StoryObj<typeof UserManagementTable>;

export const AllUsers: Story = {
  args: {
    users: [
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        id: 1,
        jobFunction: UserJobFunction.Marketing,
        acceptedTerms: true,
      },
    ],
  },
};

export const NoUsers: Story = {
  args: {
    users: [],
  },
};
