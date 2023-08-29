import { AvailableParticipantDTO } from '../../../api/routers/participantsRouter';
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
    uniqueTypes.add('publisher');
  }
  if (getDefaultAdvertiserCheckboxState(participantTypeNames)) {
    uniqueTypes.add('advertiser');
  }
  if (getDefaultDSPCheckboxState(participantTypeNames)) {
    uniqueTypes.add('dsp');
  }
  if (getDefaultDataProviderCheckboxState(participantTypeNames)) {
    uniqueTypes.add('data_provider');
  }
  return Array.from(uniqueTypes);
};

const getParticipantTypeNamesMessage = (recommendedTypes: string[]) => {
  if (recommendedTypes.length === 4) return 'participants';
  const friendlyNames: Record<string, string> = {
    publisher: 'Publishers',
    advertiser: 'Advertisers',
    dsp: 'DSPs',
    // eslint-disable-next-line camelcase
    data_provider: 'Data Providers',
  };

  const formattedNames = recommendedTypes.map((type) => friendlyNames[type]);
  return formatStringsWithSeparator(formattedNames);
};

export const hasUncheckedASharedType = (
  sharedTypes: string[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
) => {
  if (!publisherChecked && sharedTypes.includes('publisher')) return true;
  if (!advertiserChecked && sharedTypes.includes('advertiser')) return true;
  if (!DSPChecked && sharedTypes.includes('dsp')) return true;
  if (!dataProviderChecked && sharedTypes.includes('data_provider')) return true;
  return false;
};

export const getCheckedParticipantTypeNames = (data: BulkAddPermissionsForm) => {
  const ids = [];
  if (data.publisherChecked) ids.push('publisher');
  if (data.advertiserChecked) ids.push('advertiser');

  if (data.DSPChecked) ids.push('dsp');
  if (data.dataProviderChecked) ids.push('data_provider');
  return ids;
};

export const getRecommendationMessageFromTypeNames = (
  participantTypeNames: string[],
  recommendedTypes: string[]
) => {
  return `As ${getArticle(participantTypeNames[0])} ${formatStringsWithSeparator(
    participantTypeNames
  )}, we recommend you share with all ${getParticipantTypeNamesMessage(recommendedTypes)}.`;
};

export const getFilteredParticipantsByType = (
  participants: AvailableParticipantDTO[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
): AvailableParticipantDTO[] => {
  return participants.filter((p) => {
    const selectedTypes = p.types!.map((type) => type.typeName);
    if (
      (publisherChecked && selectedTypes.includes('Publisher')) ||
      (advertiserChecked && selectedTypes.includes('Advertiser')) ||
      (DSPChecked && selectedTypes.includes('DSP')) ||
      (dataProviderChecked && selectedTypes.includes('Data Provider'))
    ) {
      return true;
    }
    return false;
  });
};
