import { Meta } from '@storybook/react';

import { PortalHeader } from './PortalHeader';

export default {
  title: 'Shared Components/Portal Header',
  component: PortalHeader,
} as Meta<typeof PortalHeader>;

export const ValidEmailAddress = {
  args: {
    fullName: 'Test User',
    email: 'test.user@example.com',
  },
};

export const InvalidEmailAddress = {
  args: {
    email: '123',
  },
};

export const NoEmailAddress = {
  args: {},
};
