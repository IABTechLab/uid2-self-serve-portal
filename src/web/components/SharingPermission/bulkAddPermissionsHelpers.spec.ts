import { ClientType } from '../../../api/services/adminServiceHelpers';
import { publisherHasUncheckedDSP } from './bulkAddPermissionsHelpers';

describe('Bulk add permission helper tests', () => {
  describe('#publisherHasUncheckedDSP', () => {
    it('Returns true when DSP is unchecked, sharedTypes includes DSP, and completedRecommendations is false', () => {
      const participantTypes = [{ id: 2, typeName: 'Publisher' }];
      const DSPChecked = false;
      const sharedTypes: ClientType[] = ['DSP'];
      const completedRecommendations = false;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(true);
    });

    it('Returns true when DSP is unchecked, sharedTypes includes DSP, and completedRecommendations is true', () => {
      const participantTypes = [{ id: 2, typeName: 'Publisher' }];
      const DSPChecked = false;
      const sharedTypes: ClientType[] = ['DSP'];
      const completedRecommendations = true;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(true);
    });

    it('Returns true when DSP is unchecked, sharedTypes does not include DSP, and completedRecommendations is false', () => {
      const participantTypes = [{ id: 2, typeName: 'Publisher' }];
      const DSPChecked = false;
      const sharedTypes: ClientType[] = ['ADVERTISER'];
      const completedRecommendations = false;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(true);
    });

    it('Returns false when DSP is unchecked, sharedTypes does not include DSP, and completedRecommendations is true', () => {
      const participantTypes = [{ id: 2, typeName: 'Publisher' }];
      const DSPChecked = false;
      const sharedTypes: ClientType[] = ['ADVERTISER'];
      const completedRecommendations = true;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(false);
    });

    it('Returns false when participantTypes do not include Publisher', () => {
      const participantTypes = [{ id: 3, typeName: 'Advertiser' }];
      const DSPChecked = false;
      const sharedTypes: ClientType[] = ['DSP'];
      const completedRecommendations = false;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(false);
    });

    it('Returns false when DSP is checked', () => {
      const participantTypes = [{ id: 2, typeName: 'Publisher' }];
      const DSPChecked = true;
      const sharedTypes: ClientType[] = ['DSP'];
      const completedRecommendations = false;

      const result = publisherHasUncheckedDSP(
        participantTypes,
        DSPChecked,
        sharedTypes,
        completedRecommendations
      );

      expect(result).toBe(false);
    });
  });
});
