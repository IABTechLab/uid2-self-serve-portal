import { SharingSiteDTO } from '../../../api/helpers/siteConvertingHelpers';
import { ClientType } from '../../../api/services/adminServiceHelpers';
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
    uniqueTypes.add('PUBLISHER');
  }
  if (getDefaultAdvertiserCheckboxState(participantTypeNames)) {
    uniqueTypes.add('ADVERTISER');
  }
  if (getDefaultDSPCheckboxState(participantTypeNames)) {
    uniqueTypes.add('DSP');
  }
  if (getDefaultDataProviderCheckboxState(participantTypeNames)) {
    uniqueTypes.add('DATA_PROVIDER');
  }
  return Array.from(uniqueTypes);
};

const getParticipantTypeNamesMessage = (recommendedTypes: string[]) => {
  if (recommendedTypes.length === 4) return 'participants';
  const friendlyNames: Record<string, string> = {
    PUBLISHER: 'Publishers',
    ADVERTISER: 'Advertisers',
    DSP: 'DSPs',
    // eslint-disable-next-line camelcase
    DATA_PROVIDER: 'Data Providers',
  };

  const formattedNames = recommendedTypes.map((type) => friendlyNames[type]);
  return formatStringsWithSeparator(formattedNames);
};

export const hasUncheckedASharedType = (
  sharedTypes: ClientType[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
) => {
  if (!publisherChecked && sharedTypes.includes('PUBLISHER')) return true;
  if (!advertiserChecked && sharedTypes.includes('ADVERTISER')) return true;
  if (!DSPChecked && sharedTypes.includes('DSP')) return true;
  if (!dataProviderChecked && sharedTypes.includes('DATA_PROVIDER')) return true;
  return false;
};

const hasPendingTypeChange = (
  type: ClientType,
  isChecked: boolean,
  sharedTypes: ClientType[]
): boolean => isChecked !== sharedTypes.includes(type);

export const hasPendingTypeChanges = (
  sharedTypes: ClientType[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
): boolean => {
  return (
    hasPendingTypeChange('PUBLISHER', publisherChecked, sharedTypes) ||
    hasPendingTypeChange('ADVERTISER', advertiserChecked, sharedTypes) ||
    hasPendingTypeChange('DSP', DSPChecked, sharedTypes) ||
    hasPendingTypeChange('DATA_PROVIDER', dataProviderChecked, sharedTypes)
  );
};

export const getCheckedParticipantTypeNames = (data: BulkAddPermissionsForm) => {
  const ids = [] as ClientType[];
  if (data.publisherChecked) ids.push('PUBLISHER');
  if (data.advertiserChecked) ids.push('ADVERTISER');
  if (data.DSPChecked) ids.push('DSP');
  if (data.dataProviderChecked) ids.push('DATA_PROVIDER');
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
  participants: SharingSiteDTO[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
) => {
  return participants.filter((p) => {
    if (
      (publisherChecked && p.clientTypes?.includes('PUBLISHER')) ||
      (advertiserChecked && p.clientTypes?.includes('ADVERTISER')) ||
      (DSPChecked && p.clientTypes?.includes('DSP')) ||
      (dataProviderChecked && p.clientTypes?.includes('DATA_PROVIDER'))
    ) {
      return true;
    }
    return false;
  });
};
