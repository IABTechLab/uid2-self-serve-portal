import { Meta, StoryFn } from '@storybook/react';

import { Dialog } from '../Popups/Dialog';
import { TermsAndConditions, TermsAndConditionsForm } from './TermsAndConditions';

const meta: Meta<typeof TermsAndConditionsForm> = {
  title: 'Shared Components/Terms and Conditions',
  component: TermsAndConditionsForm,
};

export default meta;

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
