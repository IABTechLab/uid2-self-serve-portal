import { Meta } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
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
    // @ts-ignore
    onRemoveEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
    // @ts-ignore
    onUpdateEmailContact: (id, form) =>
      Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
  },
};
