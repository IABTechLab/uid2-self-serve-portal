import { Meta, StoryObj } from '@storybook/react-webpack5';

import { PortalHeader } from './PortalHeader';

const meta: Meta<typeof PortalHeader> = {
  title: 'Shared Components/Portal Header',
  component: PortalHeader,
};

export default meta;
type Story = StoryObj<typeof PortalHeader>;

export const ValidEmailAddress: Story = {
  args: {
    fullName: 'Test User',
    email: 'test.user@example.com',
  },
};

export const InvalidEmailAddress = {
  args: {
    email: '123',
		fullName: '',
		logout: () => {}
  },
};

export const NoEmailAddress = {
  args: {
		email: '',
		fullName: '',
		logout: () => {}
	},
};
