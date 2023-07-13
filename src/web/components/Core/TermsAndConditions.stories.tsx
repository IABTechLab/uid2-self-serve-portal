import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TermsAndConditions, TermsAndConditionsForm } from './TermsAndConditions';

export default {
  title: 'Shared Components/Terms and Conditions',
  component: TermsAndConditionsForm,
} as ComponentMeta<typeof TermsAndConditionsForm | typeof TermsAndConditions>;

const Template: ComponentStory<typeof TermsAndConditionsForm> = (args) => (
  <TermsAndConditionsForm {...args} />
);

export const Dialog = Template.bind({});
Dialog.args = {
  onAccept: () => {},
  onCancel: () => {},
};

const PageTemplate: ComponentStory<typeof TermsAndConditions> = (args) => (
  <TermsAndConditions {...args} />
);
export const Page = PageTemplate.bind({});
