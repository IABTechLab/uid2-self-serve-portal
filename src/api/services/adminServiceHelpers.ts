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
};

export type SharingListResponse = {
  allowed_sites: number[] | null;
  allowed_types: ClientType[];
  hash: number;
};

export type KeyPairDTO = {
  contact?: string;
  created: number;
  disabled: boolean;
  public_key: string;
  site_id: number;
  subscription_id: string;
  name?: string;
};

const AllowedSiteRoles: Record<string, AvailableClientRole[]> = {
  [ParticipantTypeData.Advertiser.typeName]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DataProvider.typeName]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DSP.typeName]: ['ID_READER', 'SHARER'],
  [ParticipantTypeData.Publisher.typeName]: ['GENERATOR', 'SHARER'],
};

export function GetRecommendedRoles(roles: ParticipantTypeDTO[]) {
  const recommendedRolesWithDuplicates = roles.flatMap((r) => AllowedSiteRoles[r.typeName]);
  return [...new Set(recommendedRolesWithDuplicates)];
}
