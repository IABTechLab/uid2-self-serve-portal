import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TermsAndConditionsForm } from './TermsAndConditions';

export default {
  title: 'Shared Components/Terms and Conditions Dialog',
  component: TermsAndConditionsForm,
} as ComponentMeta<typeof TermsAndConditionsForm>;

const Template: ComponentStory<typeof TermsAndConditionsForm> = (args) => (
  <TermsAndConditionsForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onAccept: () => {},
  onCancel: () => {},
};
