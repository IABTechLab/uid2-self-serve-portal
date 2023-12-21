/* eslint-disable camelcase */
import type { Meta, StoryObj } from '@storybook/react';

import KeyTable from './KeyTable';

const meta: Meta<typeof KeyTable> = {
  component: KeyTable,
  title: 'Api Management/API key table',
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
        key_id: 'PTFD_12',
        disabled: false,
        roles: [],
        service_id: 0,
      },
      {
        contact: 'ApiKey2',
        name: 'ApiKey2',
        created: 1701210253,
        key_id: 'FDSL,089',
        disabled: false,
        roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper' }],
        service_id: 0,
      },
      {
        contact: 'ApiKey3',
        name: 'ApiKey3',
        created: 1702830516,
        key_id: 'F4lfa.fdas',
        disabled: false,
        roles: [
          { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
          { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
        ],
        service_id: 0,
      },
      {
        contact: 'ApiKey4',
        name: 'ApiKey4',
        created: 17028300516,
        key_id: 'REIO_38',
        disabled: false,
        roles: [
          { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
          { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
          { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
        ],
        service_id: 0,
      },
      {
        contact: 'ApiKey5',
        name: 'ApiKey5',
        created: 1702840516,
        key_id: 'BNJMB_934',
        disabled: false,
        roles: [
          { id: 1, roleName: 'MAPPER', externalName: 'Mapper' },
          { id: 2, roleName: 'GENERATOR', externalName: 'Generator' },
          { id: 3, roleName: 'ID_READER', externalName: 'Bidder' },
          { id: 4, roleName: 'SHARER', externalName: 'Sharer' },
        ],
        service_id: 0,
      },
    ],
  },
};

export const NoKeys: Story = {
  args: {
    apiKeys: [],
  },
};
