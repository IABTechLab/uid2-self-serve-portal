import { z } from 'zod';

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
export type SiteDTO = {
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
