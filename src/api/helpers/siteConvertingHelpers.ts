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
    types: mapClientTypeToParticipantType(site.clientTypes ?? [], participantTypes),
  };
};

export const canBeSharedWith = (site: SiteDTO): boolean => {
  if (
    (site.roles.includes('SHARER') ||
      site.roles.includes('ID_READER') ||
      site.clientTypes?.includes('DSP')) &&
    !site.roles.includes('OPTOUT')
  )
    return true;
  return false;
};
