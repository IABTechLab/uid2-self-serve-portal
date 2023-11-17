import { ClientType } from '../../../api/services/adminServiceHelpers';
import { publisherHasUncheckedDSP } from './bulkAddPermissionsHelpers';

describe('Bulk add permission helper tests', () => {
  describe('#publisherHasUncheckedDSP', () => {
    const shareWithDsp: ClientType[] = ['DSP'];
    const publisherType = { id: 2, typeName: 'Publisher' };

    test.each([
      [true, publisherType, false, shareWithDsp, false],
      [true, publisherType, false, shareWithDsp, true],
      [false, publisherType, false, [], true],
      [false, { id: 3, typeName: 'Advertiser' }, false, shareWithDsp, false],
      [false, publisherType, true, shareWithDsp, false],
    ])(
      'returns %p when participantTypes is %p, DSPChecked is %p, sharedTypes is %p, and completedRecommendations is %p',
      (expected, participantTypes, dspChecked, sharedTypes, completedRecommendations) => {
        const result = publisherHasUncheckedDSP(
          [participantTypes],
          dspChecked,
          sharedTypes,
          completedRecommendations
        );
        expect(result).toBe(expected);
      }
    );
  });
});
