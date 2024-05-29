/* eslint-disable camelcase */
import { Meta, StoryObj } from '@storybook/react';

import RotateApiKeyCard from './RotateApiKeyCard';

const meta: Meta<typeof RotateApiKeyCard> = {
  title: 'Home/Rotate API Key Card',
  component: RotateApiKeyCard,
};
export default meta;

type Story = StoryObj<typeof RotateApiKeyCard>;

const testApiKey1 = {
  contact: 'ApiKey1',
  name: 'ApiKey1',
  created: 1672597393,
  key_id: 'F4lfa.fdas',
  site_id: 1,
  disabled: false,
  roles: [
    { id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 },
    { id: 2, roleName: 'GENERATOR', externalName: 'Generator', order: 2 },
  ],
  service_id: 0,
};

const testApiKey2 = {
  contact: 'ApiKey2',
  name: 'ApiKey2',
  created: 1675362193,
  key_id: 'FDSL,089',
  disabled: false,
  roles: [{ id: 1, roleName: 'MAPPER', externalName: 'Mapper', order: 1 }],
  service_id: 0,
  site_id: 1,
};

export const Default: Story = {
  args: {
    apiKeysToRotate: [testApiKey1],
  },
};

export const MutipleKeysToRotate: Story = {
  args: {
    apiKeysToRotate: [testApiKey1, testApiKey2],
  },
};
