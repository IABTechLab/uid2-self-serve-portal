import { CheckCircledIcon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Notification } from './Notification';

export default {
  title: 'Shared Components/Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

const Template: ComponentStory<typeof Notification> = (args) => <Notification {...args} />;

export const WithIcon = Template.bind({});
WithIcon.args = {
  Icon: CheckCircledIcon as React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >,
  notification: <p>Here is notification</p>,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  notification: <p>Here is notification information</p>,
  title: 'An title',
};

export const WithoutIconAndTitle = Template.bind({});
WithoutIconAndTitle.args = {
  notification: <p>Here is just notification</p>,
};
