import { ComponentMeta, ComponentStory } from '@storybook/react';

import { InlineError } from './InlineError';

export default {
  title: 'Shared Components/Inline Error',
  component: InlineError,
} as ComponentMeta<typeof InlineError>;

const Template: ComponentStory<typeof InlineError> = (args) => <InlineError {...args} />;

export const Default = Template.bind({});
Default.args = {
  error: 'You have an error',
};
