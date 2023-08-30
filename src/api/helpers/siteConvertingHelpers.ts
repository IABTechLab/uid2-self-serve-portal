import { ParticipantTypeDTO } from '../entities/ParticipantType';
import { AvailableParticipantDTO } from '../routers/participantsRouter';
import { ClientType, SiteDTO } from '../services/adminServiceClient';

export const mapClientTypeToParticipantType = (
  clientTypes: ClientType[],
  participantTypes: ParticipantTypeDTO[]
): ParticipantTypeDTO[] => {
  const types = [] as ParticipantTypeDTO[];
  clientTypes.forEach((clientType) => {
    const mappedType = participantTypes.find(
      (pt) => pt.typeName.toLocaleUpperCase().replace(' ', '_') === clientType
    );
    if (mappedType) types.push(mappedType);
  });
  return types;
};

export const convertSiteToAvailableParticipantDTO = (
  site: SiteDTO,
  participantTypes: ParticipantTypeDTO[]
): AvailableParticipantDTO => {
  return {
    name: site.name,
    siteId: site.id,
    types: mapClientTypeToParticipantType(site.types, participantTypes),
  };
};

export const hasSharerRole = (site: SiteDTO): boolean => {
  if (!site.types.length) return false;
  if (site.roles.includes('SHARER') || site.types.includes('DSP')) return true;
  return false;
};
