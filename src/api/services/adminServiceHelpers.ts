import { ParticipantTypeData, ParticipantTypeDTO } from '../entities/ParticipantType';

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
