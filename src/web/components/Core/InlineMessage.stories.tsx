import { ComponentMeta, ComponentStory } from '@storybook/react';

import { InlineMessage, InlineMessageProps } from './InlineMessage';

export default {
  title: 'Shared Components/Inline Message',
  component: InlineMessage,
} as ComponentMeta<typeof InlineMessage>;

const Template: ComponentStory<typeof InlineMessage> = (args: InlineMessageProps) => (
  <InlineMessage {...args} />
);

export const Info = Template.bind({});
Info.args = {
  message: 'here is an info',
  type: 'Info',
};

export const Warning = Template.bind({});
Warning.args = {
  message: 'here is a warning',
  type: 'Warning',
};

export const Error = Template.bind({});
Error.args = {
  message: 'here is an error',
  type: 'Error',
};

export const Success = Template.bind({});
Success.args = {
  message: 'here is a success',
  type: 'Success',
};
