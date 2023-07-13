import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ContactType } from '../../../api/entities/BusinessContact';
import BusinessContact from './BusinessContact';

export default {
  title: 'Business Contacts/Business Contact Item',
  component: BusinessContact,
} as ComponentMeta<typeof BusinessContact>;

const Template: ComponentStory<typeof BusinessContact> = (args) => <BusinessContact {...args} />;

export const Default = Template.bind({});
Default.args = {
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
};
