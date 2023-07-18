import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import BusinessContactsTable from './BusinessContactsTable';

export default {
  title: 'Business Contacts/Business Contacts Table',
  component: BusinessContactsTable,
} as ComponentMeta<typeof BusinessContactsTable>;

const Template: ComponentStory<typeof BusinessContactsTable> = (args) => (
  <BusinessContactsTable {...args} />
);

export const WithoutBusinessContacts = Template.bind({});
WithoutBusinessContacts.args = {
  businessContacts: [],
  onRemoveEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
  onUpdateEmailContact: (id, form) =>
    Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
  onAddEmailContact: (form) => Promise.resolve(console.log(`Add contact ${JSON.stringify(form)}`)),
};

export const WithBusinessContacts = Template.bind({});
WithBusinessContacts.args = {
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
};

export const WithDeleteError = Template.bind({});
WithDeleteError.args = {
  ...WithBusinessContacts.args,
  onRemoveEmailContact: (id) => Promise.reject(console.log(`Failed to delete contact id: ${id}`)),
};
