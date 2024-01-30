/* eslint-disable camelcase */
import { z } from 'zod';

import { ApiRole, ApiRoleDTO } from '../entities/ApiRole';
import { ParticipantApprovalPartial } from '../entities/Participant';
import { ParticipantTypeData, ParticipantTypeDTO } from '../entities/ParticipantType';

type ClientRole = 'ID_READER' | 'GENERATOR' | 'MAPPER' | 'OPTOUT' | 'SHARER';
export type ClientType = 'DSP' | 'ADVERTISER' | 'DATA_PROVIDER' | 'PUBLISHER';
export const ClientTypeDescriptions: Record<ClientType, string> = {
  ADVERTISER: 'Advertiser',
  DATA_PROVIDER: 'Data Provider',
  DSP: 'DSP',
  PUBLISHER: 'Publisher',
};
export const ClientTypes: ClientType[] = Object.keys(ClientTypeDescriptions) as ClientType[];

type AvailableClientRole = Exclude<ClientRole, 'OPTOUT'>;
export const ClientRolesWithDescriptions: Record<AvailableClientRole, string> = {
  GENERATOR: 'Generator',
  SHARER: 'Sharer',
  MAPPER: 'Mapper',
  ID_READER: 'ID Reader',
};
export type AdminSiteDTO = {
  id: number;
  name: string;
  enabled: boolean;
  roles: ClientRole[];
  clientTypes?: ClientType[];
  client_count: number;
  visible: boolean;
};

export type SharingListResponse = {
  allowed_sites: number[];
  allowed_types: ClientType[];
  hash: number;
};

export type KeyPairDTO = {
  contact?: string;
  created: number;
  disabled: boolean;
  publicKey: string;
  siteId: number;
  subscriptionId: string;
  name?: string;
};

export const AllowedSiteRoles: Record<string, AvailableClientRole[]> = {
  [ParticipantTypeData.Advertiser.typeName]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DataProvider.typeName]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DSP.typeName]: ['ID_READER', 'SHARER'],
  [ParticipantTypeData.Publisher.typeName]: ['GENERATOR', 'SHARER'],
};

export function GetRecommendedRoles(roles: ParticipantTypeDTO[]) {
  const recommendedRolesWithDuplicates = roles.flatMap((r) => AllowedSiteRoles[r.typeName]);
  return [...new Set(recommendedRolesWithDuplicates)];
}

export const mapClientTypesToAdminEnums = (
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial>
): string[] => {
  return participantApprovalPartial.types.map((type) => {
    let adminEnum = 'UNKNOWN';
    switch (type.id) {
      case 1:
        adminEnum = 'DSP';
        break;
      case 2:
        adminEnum = 'ADVERTISER';
        break;
      case 3:
        adminEnum = 'DATA_PROVIDER';
        break;
      case 4:
        adminEnum = 'PUBLISHER';
        break;
    }
    return adminEnum;
  });
};

export type ApiKeyDTO = {
  key_id: string;
  name: string;
  contact: string;
  roles: ApiRoleDTO[];
  created: number;
  disabled: boolean;
  service_id: number;
  site_id: number;
};

export type CreatedApiKeyDTO = {
  authorizable: ApiKeyDTO & { key_hash: string; key_salt: string; secret: string };
  plaintext_key: string;
};

export type ApiKeyAdmin = Omit<ApiKeyDTO, 'roles'> & { roles: string };

function mapAdminRolesToApiRoleDTOs(adminRoles: string[], apiRoleMap: Map<String, ApiRoleDTO>) {
  return adminRoles.map((adminRole) => {
    const adminRoleTrimmed = adminRole.trim();

    let apiRole = apiRoleMap.get(adminRoleTrimmed);

    if (apiRole === undefined) {
      apiRole = ApiRole.fromJson({
        roleName: adminRoleTrimmed,
        externalName: adminRoleTrimmed,
      });
      apiRoleMap.set(adminRoleTrimmed, apiRole);
    }

    return apiRole;
  });
}

export async function mapAdminApiKeysToApiKeyDTOs(
  adminApiKeys: ApiKeyAdmin[]
): Promise<ApiKeyDTO[]> {
  const apiRoleList = await ApiRole.query();
  const apiRoleMap = new Map<String, ApiRoleDTO>(
    apiRoleList.map((apiRole) => [apiRole.roleName, apiRole as ApiRoleDTO])
  );

  return adminApiKeys.map((adminKey) => {
    const roles = mapAdminRolesToApiRoleDTOs(adminKey.roles.split(','), apiRoleMap);

    return {
      key_id: adminKey.key_id,
      name: adminKey.name,
      contact: adminKey.contact,
      created: adminKey.created,
      disabled: adminKey.disabled,
      site_id: adminKey.site_id,
      roles,
      service_id: adminKey.service_id,
    };
  });
}
