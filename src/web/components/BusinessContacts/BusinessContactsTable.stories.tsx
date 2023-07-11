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
  removeEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
  updateEmailContact: (id, form) =>
    Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
  addEmailContact: (form) => Promise.resolve(console.log(`Add contact ${JSON.stringify(form)}`)),
  onBusinessContactUpdated: () => console.log('Business contact updated'),
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
