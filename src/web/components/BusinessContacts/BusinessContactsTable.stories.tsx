import { Meta } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import { BusinessContactForm } from '../../services/participant';
import BusinessContactsTable from './BusinessContactsTable';

export default {
  title: 'Business Contacts/Business Contacts Table',
  component: BusinessContactsTable,
} as Meta<typeof BusinessContactsTable>;

export const WithoutBusinessContacts = {
  args: {
    businessContacts: [],
    onRemoveEmailContact: (id: number) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
    onUpdateEmailContact: (id: number, form: BusinessContactForm) =>
      Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
    onAddEmailContact: (form: BusinessContactForm) =>
      Promise.resolve(console.log(`Add contact ${JSON.stringify(form)}`)),
  },
};

export const WithBusinessContacts = {
  args: {
    ...WithoutBusinessContacts.args,
    businessContacts: [
      {
        id: 1,
        name: 'Business Team',
        emailAlias: 'Business_team@test.com',
        contactType: ContactType.Business,
        participantId: 1,
      },
      {
        id: 2,
        name: 'Tech Team',
        emailAlias: 'tech_team@test.com',
        contactType: ContactType.Technical,
        participantId: 1,
      },
    ],
  },
};

export const WithDeleteError = {
  args: {
    ...WithBusinessContacts.args,
    onRemoveEmailContact: (id: number) =>
      Promise.reject(console.log(`Failed to delete contact id: ${id}`)),
  },
};
