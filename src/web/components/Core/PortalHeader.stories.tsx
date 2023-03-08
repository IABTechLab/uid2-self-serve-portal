import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PortalHeader } from './PortalHeader';

export default {
  title: 'Shared Components/Portal Header',
  component: PortalHeader,
} as ComponentMeta<typeof PortalHeader>;

const Template: ComponentStory<typeof PortalHeader> = (args) => <PortalHeader {...args} />;

export const WithGravatar = Template.bind({});
WithGravatar.args = {
  email: 'lionell.pack@thetradedesk.com',
};

export const InvalidEmailAddress = Template.bind({});
InvalidEmailAddress.args = {
  email: '123',
};

export const NoEmailAddress = Template.bind({});
NoEmailAddress.args = {
  email: '1f9b869cd86ed628fd2a9f8c74f9b0f3',
};
