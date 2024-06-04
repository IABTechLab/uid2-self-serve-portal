import { Meta, StoryObj } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import BusinessContact from './BusinessContact';

const meta: Meta<typeof BusinessContact> = {
  title: 'Business Contacts/Business Contact Item',
  component: BusinessContact,
};

export default meta;
type Story = StoryObj<typeof BusinessContact>;

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
