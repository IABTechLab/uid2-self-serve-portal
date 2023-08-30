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
