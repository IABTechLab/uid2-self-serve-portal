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
