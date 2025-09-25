import { Meta, StoryObj } from '@storybook/react-webpack5';

import { ContactType } from '../../../api/entities/EmailContact';
import EmailContactsTable from './EmailContactsTable';

const meta: Meta<typeof EmailContactsTable> = {
  title: 'Email Contacts/Email Contacts Table',
  component: EmailContactsTable,
};

export default meta;
type Story = StoryObj<typeof EmailContactsTable>;

export const WithoutEmailContacts: Story = {
  args: {
    emailContacts: [],
    onRemoveEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
    onUpdateEmailContact: (id, form) =>
      Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
    onAddEmailContact: (form) =>
      Promise.resolve(console.log(`Add contact ${JSON.stringify(form)}`)),
  },
};

export const WithEmailContacts: Story = {
  args: {
    ...WithoutEmailContacts.args,
    emailContacts: [
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

export const WithDeleteError: Story = {
  args: {
    ...WithEmailContacts.args,
    onRemoveEmailContact: (id) => Promise.reject(console.log(`Failed to delete contact id: ${id}`)),
  },
};
