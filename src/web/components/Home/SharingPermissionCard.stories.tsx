import { ComponentMeta, ComponentStory } from '@storybook/react';

import SharingPermissionCard from './SharingPermissionCard';

export default {
  title: 'Home/Sharing Permissions Card',
  component: SharingPermissionCard,
} as ComponentMeta<typeof SharingPermissionCard>;
const Template: ComponentStory<typeof SharingPermissionCard> = (args) => {
  return <SharingPermissionCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  sharingPermissionsCount: 100,
};

export const WithError = Template.bind({});
WithError.args = {
  error: { message: 'some error' },
};
