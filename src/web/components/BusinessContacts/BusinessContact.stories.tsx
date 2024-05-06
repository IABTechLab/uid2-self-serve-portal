import { Meta } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import { BusinessContactForm } from '../../services/participant';
import BusinessContact from './BusinessContact';

export default {
  title: 'Business Contacts/Business Contact Item',
  component: BusinessContact,
} as Meta<typeof BusinessContact>;

export const Default = {
  args: {
    contact: {
      id: 1,
      name: 'Business Team',
      emailAlias: 'Business_team@test.com',
      contactType: ContactType.Business,
      participantId: 1,
    },
    onRemoveEmailContact: (id: number) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
    onUpdateEmailContact: (id: number, form: BusinessContactForm) =>
      Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
  },
};
