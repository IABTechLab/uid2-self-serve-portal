import type { Meta, StoryObj } from '@storybook/react';

import KeyTable from './KeyTable';

const meta: Meta<typeof KeyTable> = {
  component: KeyTable,
  title: 'ApiManagement/API key table',
};
export default meta;

type Story = StoryObj<typeof KeyTable>;

export const ManyKeys: Story = {
  args: {
    apiKeys: [
      {
        contact: 'ApiKey1',
        name: 'ApiKey1',
        created: 1702860516,
        keyId: 'PTFD_12',
        disabled: false,
        roles: [],
        serviceId: 0,
      },
      {
        contact: 'ApiKey2',
        name: 'ApiKey2',
        created: 1701210253,
        keyId: 'FDSL,089',
        disabled: false,
        roles: [{ id: 1, roleName: 'Role1', externalName: 'Role 1' }],
        serviceId: 0,
      },
      {
        contact: 'ApiKey3',
        name: 'ApiKey3',
        created: 1702830516,
        keyId: 'FDSL,089',
        disabled: false,
        roles: [
          { id: 1, roleName: 'Role1', externalName: 'Role 1' },
          { id: 2, roleName: 'Role2', externalName: 'Role 2' },
        ],
        serviceId: 0,
      },
      {
        contact: 'ApiKey4',
        name: 'ApiKey4',
        created: 17028300516,
        keyId: 'REIO_38',
        disabled: false,
        roles: [
          { id: 1, roleName: 'Role1', externalName: 'Role 1' },
          { id: 2, roleName: 'Role2', externalName: 'Role 2' },
          { id: 2, roleName: 'Role3', externalName: 'Role 3' },
        ],
        serviceId: 0,
      },
      {
        contact: 'ApiKey5',
        name: 'ApiKey5',
        created: 1702840516,
        keyId: 'BNJMB_934',
        disabled: false,
        roles: [
          { id: 1, roleName: 'Role1', externalName: 'Role 1' },
          { id: 2, roleName: 'Role2', externalName: 'Role 2' },
          { id: 2, roleName: 'Role3', externalName: 'Role 3' },
          { id: 2, roleName: 'Role3', externalName: 'Role 4' },
        ],
        serviceId: 0,
      },
    ],
  },
};

export const NoKeys: Story = {
  args: {
    apiKeys: [],
  },
};
