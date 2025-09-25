import { Meta, StoryObj } from '@storybook/react-webpack5';

import { ContactType } from '../../../api/entities/EmailContact';
import EmailContact from './EmailContact';

const meta: Meta<typeof EmailContact> = {
  title: 'Email Contacts/Email Contact Item',
  component: EmailContact,
};

export default meta;
type Story = StoryObj<typeof EmailContact>;

export const Default: Story = {
  args: {
    contact: {
      id: 1,
      name: 'Business Team',
      emailAlias: 'Business_team@test.com',
      contactType: ContactType.Business,
      participantId: 1,
    },
    onRemoveEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
    onUpdateEmailContact: (id, form) =>
      Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
  },
};
