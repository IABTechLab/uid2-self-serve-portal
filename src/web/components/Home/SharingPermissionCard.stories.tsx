import { Meta, StoryFn } from '@storybook/react';

import SharingPermissionCard from './SharingPermissionCard';

export default {
  title: 'Home/Sharing Permissions Card',
  component: SharingPermissionCard,
} as Meta<typeof SharingPermissionCard>;
const Template: StoryFn<typeof SharingPermissionCard> = (args) => {
  return <SharingPermissionCard {...args} />;
};

export const Default = {
  render: Template,

  args: {
    sharingPermissionsCount: 100,
  },
};

export const WithError = {
  render: Template,

  args: {
    hasError: true,
  },
};
