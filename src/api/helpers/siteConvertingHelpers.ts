import { Participant } from '../entities/Participant';
import { ParticipantTypeDTO } from '../entities/ParticipantType';
import { AdminSiteDTO, ClientType } from '../services/adminServiceHelpers';

export type SharingSiteDTO = Pick<AdminSiteDTO, 'clientTypes' | 'id' | 'name'> & {
  canBeSharedWith: boolean;
};
export type SharingSiteWithSource = SharingSiteDTO & {
  addedBy: (ClientType | 'Manual')[];
};

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

export const canBeSharedWith = (site: AdminSiteDTO): boolean => {
  if (
    (site.roles.includes('SHARER') ||
      (site.roles.includes('ID_READER') && site.clientTypes?.includes('DSP'))) &&
    !site.roles.includes('OPTOUT')
  )
    return true;
  return false;
};

export const convertSiteToSharingSiteDTO = (
  site: AdminSiteDTO,
  participants: Participant[]
): SharingSiteDTO => {
  const matchedParticipant = participants.find((p) => p.siteId === site.id);
  return {
    name: matchedParticipant ? matchedParticipant.name : site.name,
    id: site.id,
    clientTypes: site.clientTypes,
    canBeSharedWith: canBeSharedWith(site),
  };
};
