import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Banner, BannerProps } from './Banner';

export default {
  title: 'Shared Components/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>;

const Template: ComponentStory<typeof Banner> = (args: BannerProps) => <Banner {...args} />;

export const Info = Template.bind({});
Info.args = {
  message: 'here is an info banner',
  type: 'Info',
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'here is a warning banner',
  type: 'Warning',
};

export const Error = Template.bind({});
Error.args = {
  message: 'here is an error banner',
  type: 'Error',
};

export const Success = Template.bind({});
Success.args = {
  message: 'here is a success banner',
  type: 'Success',
};
