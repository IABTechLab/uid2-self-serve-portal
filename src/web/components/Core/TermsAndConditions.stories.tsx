import { Meta, StoryFn } from '@storybook/react';

import { Dialog } from './Dialog';
import { TermsAndConditions, TermsAndConditionsForm } from './TermsAndConditions';

export default {
  title: 'Shared Components/Terms and Conditions',
  component: TermsAndConditionsForm,
} as Meta<typeof TermsAndConditionsForm | typeof TermsAndConditions>;

const Template: StoryFn<typeof TermsAndConditionsForm> = (args) => (
  <Dialog className='terms-conditions-dialog'>
    <TermsAndConditionsForm {...args} />
  </Dialog>
);

export const AsDialog = {
  render: Template,

  args: {
    onAccept: () => {},
    onCancel: () => {},
  },
};

const PageTemplate: StoryFn<typeof TermsAndConditions> = (args) => <TermsAndConditions {...args} />;

export const Page = {
  render: PageTemplate,
};
