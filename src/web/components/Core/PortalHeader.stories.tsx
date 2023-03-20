import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PortalHeader } from './PortalHeader';

export default {
  title: 'Shared Components/Portal Header',
  component: PortalHeader,
} as ComponentMeta<typeof PortalHeader>;

const Template: ComponentStory<typeof PortalHeader> = (args) => <PortalHeader {...args} />;

export const ValidEmailAddress = Template.bind({});
ValidEmailAddress.args = {
  fullname: 'Test User',
  email: 'test.user@example.com',
};

export const InvalidEmailAddress = Template.bind({});
InvalidEmailAddress.args = {
  email: '123',
};

export const NoEmailAddress = Template.bind({});
NoEmailAddress.args = {};
