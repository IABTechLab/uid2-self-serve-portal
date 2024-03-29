import { ParticipantTypeData, ParticipantTypeDTO } from '../../../api/entities/ParticipantType';
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

export const hasPendingTypeChanges = (
  sharedTypes: ClientType[],
  publisherChecked: boolean,
  advertiserChecked: boolean,
  DSPChecked: boolean,
  dataProviderChecked: boolean
): boolean => {
  return (
    publisherChecked !== sharedTypes.includes('PUBLISHER') ||
    advertiserChecked !== sharedTypes.includes('ADVERTISER') ||
    DSPChecked !== sharedTypes.includes('DSP') ||
    dataProviderChecked !== sharedTypes.includes('DATA_PROVIDER')
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

export const publisherHasUncheckedDSP = (
  participantTypes: ParticipantTypeDTO[],
  DSPChecked: boolean,
  sharedTypes: ClientType[],
  completedRecommendations: boolean
) => {
  return (
    participantTypes.some((type) => type.typeName === ParticipantTypeData.Publisher.typeName) &&
    !DSPChecked &&
    (sharedTypes.includes('DSP') || completedRecommendations === false)
  );
};
