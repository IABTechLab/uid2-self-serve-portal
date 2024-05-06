import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Dialog } from './Dialog';
import { TermsAndConditions, TermsAndConditionsForm } from './TermsAndConditions';

export default {
  title: 'Shared Components/Terms and Conditions',
  component: TermsAndConditionsForm,
} as ComponentMeta<typeof TermsAndConditionsForm | typeof TermsAndConditions>;

const Template: ComponentStory<typeof TermsAndConditionsForm> = (args) => (
  <Dialog className='terms-conditions-dialog'>
    <TermsAndConditionsForm {...args} />
  </Dialog>
);

export const AsDialog = Template.bind({});
AsDialog.args = {
  onAccept: () => {},
  onCancel: () => {},
};

const PageTemplate: ComponentStory<typeof TermsAndConditions> = (args) => (
  <TermsAndConditions {...args} />
);
export const Page = PageTemplate.bind({});
