/* eslint-disable camelcase */

import type { Meta, StoryObj } from '@storybook/react';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import KeyDisableDialog from './KeyDisableDialog';

const meta: Meta<typeof KeyDisableDialog> = {
  component: KeyDisableDialog,
  title: 'Api Management/Key Disable Dialog',
};
export default meta;

type Story = StoryObj<typeof KeyDisableDialog>;

export const DisableApiKey: Story = {
  args: {
    triggerButton: <button type='button'>Open</button>,
    onDisable: (key: ApiKeyDTO) => {
      console.log(`Disabling Key ${key.name}`);
    },
    apiKey: {
      contact: 'ApiKey',
      name: 'Test ApiKey 1',
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
  },
};
