import { Meta, StoryObj } from '@storybook/react';

import { AuditTrailEvents } from '../../../api/entities/AuditTrail';
import AuditLogTable from './AuditLogTable';

const meta: Meta<typeof AuditLogTable> = {
  title: 'Audit Logs/Audit Logs Table',
  component: AuditLogTable,
};

export default meta;
type Story = StoryObj<typeof AuditLogTable>;

export const WithoutLogRows: Story = {
  args: {
    auditTrail: [],
  },
};

export const WithLogRows: Story = {
  args: {
    auditTrail: [
      {
        id: 1,
        userId: 22,
        userEmail: 'test@testing.com',
        succeeded: true,
        event: AuditTrailEvents.ApproveAccount,
        eventData: '{"siteId":1001,"apiRoles":[]}',
      },
      {
        id: 2,
        userId: 33,
        userEmail: 'anotherTest@testing.com',
        succeeded: false,
        event: AuditTrailEvents.UpdateAppNames,
        eventData: '{"action":"update","siteId":999,"appNames":["234213423"]}',
      },
    ],
  },
};

// export const WithoutBusinessContacts: Story = {
//   args: {
//     businessContacts: [],
//     onRemoveEmailContact: (id) => Promise.resolve(console.log(`Delete contact id: ${id}`)),
//     onUpdateEmailContact: (id, form) =>
//       Promise.resolve(console.log(`Update contact id: ${id} with ${JSON.stringify(form)}`)),
//     onAddEmailContact: (form) =>
//       Promise.resolve(console.log(`Add contact ${JSON.stringify(form)}`)),
//   },
// };

// export const WithBusinessContacts: Story = {
//   args: {
//     ...WithoutBusinessContacts.args,
//     businessContacts: [
//       {
//         id: 1,
//         name: 'Business Team',
//         emailAlias: 'Business_team@test.com',
//         contactType: ContactType.Business,
//         participantId: 1,
//       },
//       {
//         id: 2,
//         name: 'Tech Team',
//         emailAlias: 'tech_team@test.com',
//         contactType: ContactType.Technical,
//         participantId: 1,
//       },
//     ],
//   },
// };

// export const WithDeleteError: Story = {
//   args: {
//     ...WithBusinessContacts.args,
//     onRemoveEmailContact: (id) => Promise.reject(console.log(`Failed to delete contact id: ${id}`)),
//   },
// };
