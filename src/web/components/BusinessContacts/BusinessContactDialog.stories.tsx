import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import BusinessContactDialog from './BusinessContactDialog';

export default {
  title: 'Business Contacts/Business Contacts Dialog',
  component: BusinessContactDialog,
} as ComponentMeta<typeof BusinessContactDialog>;

const Template: ComponentStory<typeof BusinessContactDialog> = (args) => (
  <BusinessContactDialog {...args} />
);

export const WithoutBusinessContact = Template.bind({});
WithoutBusinessContact.args = {
  triggerButton: <button type='button'>Open</button>,
  onFormSubmit: (formData) =>
    Promise.resolve(console.log(`contact from submit with ${JSON.stringify(formData)}`)),
  onFormSubmitted: () => console.log('Business contact submitted'),
};

export const WithBusinessContact = Template.bind({});
WithBusinessContact.args = {
  contact: {
    id: 1,
    name: 'Business Team',
    emailAlias: 'Business_team@test.com',
    contactType: ContactType.Business,
    participantId: 1,
  },
  ...WithoutBusinessContact.args,
};

export const WithSubmitError = Template.bind({});
WithSubmitError.args = {
  ...WithoutBusinessContact.args,
  contact: {
    id: 1,
    name: 'Business Team',
    emailAlias: 'Business_team@test.com',
    contactType: ContactType.Business,
    participantId: 1,
  },
  onFormSubmit: (formData) => Promise.reject(),
};
