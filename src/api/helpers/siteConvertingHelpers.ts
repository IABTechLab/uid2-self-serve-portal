import { Participant } from '../entities/Participant';
import { ParticipantTypeDTO } from '../entities/ParticipantType';
import { AvailableParticipantDTO } from '../routers/participantsRouter';
import { ClientType, SiteDTO } from '../services/adminServiceHelpers';

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
  participantTypes: ParticipantTypeDTO[],
  participants: Participant[]
): AvailableParticipantDTO => {
  const matchedParticipant = participants.find((p) => p.siteId === site.id);
  return {
    name: matchedParticipant ? matchedParticipant.name : site.name,
    siteId: site.id,
    types:
      matchedParticipant && matchedParticipant.types
        ? matchedParticipant.types
        : mapClientTypeToParticipantType(site.clientTypes ?? [], participantTypes),
  };
};

export const hasSharerRole = (site: SiteDTO): boolean => {
  if (!site.clientTypes || !site.clientTypes.length) return false;
  if (site.roles.includes('SHARER') || site.clientTypes?.includes('DSP')) return true;
  return false;
};
