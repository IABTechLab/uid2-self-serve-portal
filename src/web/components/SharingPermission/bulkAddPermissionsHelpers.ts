import { ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
import { formatStringsWithSeparator, getArticle } from '../../utils/textHelpers';

export type BulkAddPermissionsForm = {
  publisherChecked: boolean;
  advertiserChecked: boolean;
  DSPChecked: boolean;
  dataProviderChecked: boolean;
};

export const getDefaultPublisherCheckboxState = (participantTypeNames: string[]) => {
  const publisherRelatedTypes = ['Data Provider'];
  return participantTypeNames.some((type) => publisherRelatedTypes.includes(type));
};

export const getDefaultAdvertiserCheckboxState = (participantTypeNames: string[]) => {
  const advertiserRelatedTypes = ['Data Provider', 'DSP'];
  return participantTypeNames.some((type) => advertiserRelatedTypes.includes(type));
};

export const getDefaultDSPCheckboxState = (participantTypeNames: string[]) => {
  const DSPRelatedTypes = ['Data Provider', 'Advertiser', 'Publisher'];
  return participantTypeNames.some((type) => DSPRelatedTypes.includes(type));
};

export const getDefaultDataProviderCheckboxState = (participantTypeNames: string[]) => {
  const dataProviderRelatedTypes = ['Advertiser', 'DSP'];
  return participantTypeNames.some((type) => dataProviderRelatedTypes.includes(type));
};

export const getRecommendedTypeFromParticipant = (participantTypeNames: string[]) => {
  const uniqueTypes = new Set<string>();
  if (getDefaultPublisherCheckboxState(participantTypeNames)) {
    uniqueTypes.add('Publishers');
  }
  if (getDefaultAdvertiserCheckboxState(participantTypeNames)) {
    uniqueTypes.add('Advertisers');
  }
  if (getDefaultDSPCheckboxState(participantTypeNames)) {
    uniqueTypes.add('DSPs');
  }
  if (getDefaultDataProviderCheckboxState(participantTypeNames)) {
    uniqueTypes.add('Data Providers');
  }
  const result = Array.from(uniqueTypes);
  if (result.length === 4) return 'participants';

  return formatStringsWithSeparator(result);
};

export const getCheckedParticipantTypeIds = (
  data: BulkAddPermissionsForm,
  participantTypes: ParticipantTypeDTO[]
) => {
  const ids = [];
  if (data.publisherChecked)
    ids.push(participantTypes.find((x) => x.typeName === 'Publisher')?.id!);
  if (data.advertiserChecked)
    ids.push(participantTypes.find((x) => x.typeName === 'Advertiser')?.id!);
  if (data.DSPChecked) ids.push(participantTypes.find((x) => x.typeName === 'DSP')?.id!);
  if (data.dataProviderChecked)
    ids.push(participantTypes.find((x) => x.typeName === 'Data Provider')?.id!);
  return ids;
};

export const getRecommendationMessageFromTypeNames = (participantTypeNames: string[]) => {
  return `As ${getArticle(participantTypeNames[0])} ${formatStringsWithSeparator(
    participantTypeNames
  )}, we recommend you share with all ${getRecommendedTypeFromParticipant(participantTypeNames)}.`;
};
