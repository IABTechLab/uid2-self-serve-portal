import { formatStringsWithSeparator, getArticle } from '../../utils/textHelpers';

export const getDefaultPublisherCheckboxState = (participantTypeNames: string[]) => {
  if (participantTypeNames?.includes('Data Provider')) return true;
  return false;
};

export const getDefaultAdvertiserCheckboxState = (participantTypeNames: string[]) => {
  if (participantTypeNames?.includes('Data Provider') || participantTypeNames?.includes('DSP')) {
    return true;
  }
  return false;
};

export const getDefaultDSPCheckboxState = (participantTypeNames: string[]) => {
  if (
    participantTypeNames?.includes('Data Provider') ||
    participantTypeNames?.includes('Advertiser') ||
    participantTypeNames?.includes('Publisher')
  ) {
    return true;
  }
  return false;
};

export const getDefaultDataProviderCheckboxState = (participantTypeNames: string[]) => {
  if (participantTypeNames?.includes('Advertiser') || participantTypeNames?.includes('DSP')) {
    return true;
  }
  return false;
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

export const getRecommendationMessageFromTypeNames = (participantTypeNames: string[]) => {
  return `As ${getArticle(participantTypeNames[0])} ${formatStringsWithSeparator(
    participantTypeNames
  )}, we recommend you share with all ${getRecommendedTypeFromParticipant(participantTypeNames)}.`;
};
