import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
import { ClientType, SiteDTO } from '../../../api/services/adminServiceClient';
import { preloadSiteList } from '../../services/site';

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

export const fetchAndConvertSitesToParticipants = async (
  participantTypes: ParticipantTypeDTO[]
): Promise<AvailableParticipantDTO[]> => {
  const siteList = await preloadSiteList();
  return siteList.map((site: SiteDTO) =>
    convertSiteToAvailableParticipantDTO(site, participantTypes)
  );
};
