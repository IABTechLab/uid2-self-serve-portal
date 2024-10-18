/* eslint-disable camelcase */
import { Meta, StoryObj } from '@storybook/react';

import { AuditTrailEvents } from '../../../api/entities/AuditTrail';
import AuditTrailTable from './AuditTrailTable';

const meta: Meta<typeof AuditTrailTable> = {
  title: 'Audit Trail/Audit Trail Table',
  component: AuditTrailTable,
};

export default meta;
type Story = StoryObj<typeof AuditTrailTable>;

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
        eventData: { action: 'add', siteId: 1001, apiRoles: [1, 4] },
        updated_at: new Date('2024-07-01 21:59:45.9266667'),
      },
      {
        id: 2,
        userId: 33,
        userEmail: 'anotherTest@testing.com',
        succeeded: false,
        event: AuditTrailEvents.UpdateAppNames,
        eventData: { action: 'update', siteId: 999, appNames: ['234213423'] },
        updated_at: new Date('2024-08-23 20:53:52.1933333'),
      },
    ],
  },
};
