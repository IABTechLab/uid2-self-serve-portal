import { Meta, StoryObj } from '@storybook/react';

import SharingPermissionCard from './SharingPermissionCard';

const meta: Meta<typeof SharingPermissionCard> = {
  title: 'Home/Sharing Permissions Card',
  component: SharingPermissionCard,
};
export default meta;

type Story = StoryObj<typeof SharingPermissionCard>;

export const Default: Story = {
  args: {
    sharingPermissionsCount: 100,
  },
};
