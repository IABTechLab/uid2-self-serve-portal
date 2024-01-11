/* eslint-disable no-console */
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
      disabled: false,
      roles: [
        { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
        { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      ],
      service_id: 0,
    },
    availableRoles: [
      { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
      { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
      { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
      { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
    ],
    onEdit: (form) => {
      console.log(form);
      return Promise.resolve();
    },
    triggerButton: <button type='button'>Open</button>,
  },
};
