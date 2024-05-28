/* eslint-disable camelcase */
import type { Meta, StoryObj } from '@storybook/react';

import { ApiRoleDTO, apiRoles } from '../../../api/entities/ApiRole';
import { OnApiKeyDisable } from './KeyDisableDialog';
import { OnApiKeyEdit } from './KeyEditDialog';
import KeyTable from './KeyTable';

const meta: Meta<typeof KeyTable> = {
  component: KeyTable,
  title: 'Api Management/API Key Table',
};
export default meta;

type Story = StoryObj<typeof KeyTable>;

const apiRolesMap = new Map<string, ApiRoleDTO>(
  apiRoles.map((apiRole) => [apiRole.roleName, apiRole])
);

const apiRoleNameToApiRoleDTO = (roleNames: string[]) => {
  return roleNames.map((roleName) => apiRolesMap.get(roleName)!);
};

const onKeyEdit: OnApiKeyEdit = (form, setApiKey) => {
  console.log(`editing ${form.keyId}`);

  setApiKey((oldApiKey) => {
    const newApiKey = { ...oldApiKey };
    newApiKey.name = form.newName;
    newApiKey.roles = apiRoleNameToApiRoleDTO(form.newApiRoles);

    return newApiKey;
  });
};

const onKeyDisable: OnApiKeyDisable = (apiKey) => {
  console.log(`DELETING ${apiKey.name}`);
};

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
        site_id: 1,
      },
      {
        contact: 'ApiKey2',
        name: 'ApiKey2',
        created: 1701210253,
        key_id: 'FDSL,089',
        disabled: false,
        roles: apiRoleNameToApiRoleDTO(['MAPPER']),
        service_id: 0,
        site_id: 1,
      },
      {
        contact: 'ApiKey3',
        name: 'ApiKey3',
        created: 1702830516,
        key_id: 'F4lfa.fdas',
        disabled: false,
        roles: apiRoleNameToApiRoleDTO(['MAPPER', 'GENERATOR']),
        service_id: 0,
        site_id: 1,
      },
      {
        contact: 'ApiKey4',
        name: 'ApiKey4',
        created: 17028300516,
        key_id: 'REIO_38',
        disabled: false,
        roles: apiRoleNameToApiRoleDTO(['MAPPER', 'GENERATOR', 'ID_READER']),
        service_id: 0,
        site_id: 1,
      },
      {
        contact: 'ApiKey5',
        name: 'ApiKey5',
        created: 1702840516,
        key_id: 'BNJMB_934',
        disabled: false,
        roles: apiRoleNameToApiRoleDTO(['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER']),
        service_id: 0,
        site_id: 1,
      },
      {
        contact: 'ApiKey6',
        name: 'ApiKey6',
        created: 1702840516,
        key_id: 'FDSFDFS_934',
        disabled: false,
        roles: apiRoleNameToApiRoleDTO(['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER', 'OPTOUT']),
        service_id: 0,
        site_id: 1,
      },
    ],
    availableRoles: apiRoleNameToApiRoleDTO(['MAPPER', 'GENERATOR', 'ID_READER', 'SHARER']),
    onKeyEdit,
    onKeyDisable,
  },
};

export const NoKeys: Story = {
  args: {
    apiKeys: [],
    availableRoles: [],
    onKeyEdit,
    onKeyDisable,
  },
};
