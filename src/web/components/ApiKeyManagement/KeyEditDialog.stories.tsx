/* eslint-disable camelcase */
import type { Meta, StoryObj } from '@storybook/react';

import KeyEditDialog from './KeyEditDialog';

const meta: Meta<typeof KeyEditDialog> = {
  component: KeyEditDialog,
  title: 'Api Management/Edit Key Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyEditDialog>;

export const MultipleRoles: Story = {
  args: {
    apiKey: {
      contact: 'ApiKey',
      name: 'ApiKey',
      created: 1702830516,
      key_id: 'F4lfa.fdas',
      site_id: 1,
      disabled: false,
      roles: [
        { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
        { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      ],
      service_id: 0,
    },
    availableRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer', order: 3 },
    ],
    onEdit: (form) => {
      console.log(form);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};

export const KeyWithRolesParticipantIsntAllowed: Story = {
  args: {
    apiKey: {
      contact: 'ApiKey',
      name: 'ApiKey',
      site_id: 1,
      created: 1702830516,
      key_id: 'F4lfa.fdas',
      disabled: false,
      roles: [
        { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
        { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      ],
      service_id: 0,
    },
    availableRoles: [
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder', order: 4 },
    ],
    onEdit: (form) => {
      console.log(form);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};

export const KeyWithOnlyOneRole: Story = {
  args: {
    apiKey: {
      contact: 'ApiKey',
      name: 'ApiKey',
      site_id: 1,
      created: 1702830516,
      key_id: 'F4lfa.fdas',
      disabled: false,
      roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 }],
      service_id: 0,
    },
    availableRoles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 }],
    onEdit: (form) => {
      console.log(form);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};
