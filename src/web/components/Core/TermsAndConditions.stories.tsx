import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TermsAndConditions } from './TermsAndConditions';

export default {
  title: 'Shared Components/Terms and Conditions Dialog',
  component: TermsAndConditions,
} as ComponentMeta<typeof TermsAndConditions>;

const Template: ComponentStory<typeof TermsAndConditions> = (args) => (
  <TermsAndConditions {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onAccept: () => {},
  onCancel: () => {},
};
