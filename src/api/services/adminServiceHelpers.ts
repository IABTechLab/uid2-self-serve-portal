import {
  ParticipantType,
  ParticipantTypeData,
  ParticipantTypeDTO,
} from '../entities/ParticipantType';

type ClientRole = 'ID_READER' | 'GENERATOR' | 'MAPPER' | 'OPTOUT' | 'SHARER';
export type ClientType = 'DSP' | 'ADVERTISER' | 'DATA_PROVIDER' | 'PUBLISHER';
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
  types: ClientType[];
  client_count: number;
};

export type SharingListResponse = {
  allowed_sites: number[];
  hash: number;
};

export const AllowedSiteRoles: Record<number, AvailableClientRole[]> = {
  [ParticipantTypeData.Advertiser.id]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DataProvider.id]: ['MAPPER', 'SHARER'],
  [ParticipantTypeData.DSP.id]: ['ID_READER', 'SHARER'],
  [ParticipantTypeData.Publisher.id]: ['GENERATOR', 'SHARER'],
};

export function GetRecommendedRoles(roles: ParticipantTypeDTO[]) {
  const recommendedRolesWithDuplicates = roles.flatMap((r) => AllowedSiteRoles[r.id]);
  return [...new Set(recommendedRolesWithDuplicates)];
}
