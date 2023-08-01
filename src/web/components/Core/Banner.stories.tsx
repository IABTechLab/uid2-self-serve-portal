import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Banner } from './Banner';

export default {
  title: 'Shared Components/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>;

const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />;

export const Info = Template.bind({});
Info.args = {
  message: 'here is an info banner',
  type: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'here is a warning banner',
  type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  message: 'here is an error banner',
  type: 'error',
};
