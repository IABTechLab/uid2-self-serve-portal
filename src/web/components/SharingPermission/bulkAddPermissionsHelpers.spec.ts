import { ClientType } from '../../../api/services/adminServiceHelpers';
import { publisherHasUncheckedDSP } from './bulkAddPermissionsHelpers';

describe('Bulk add permission helper tests', () => {
  describe('#publisherHasUncheckedDSP', () => {
    const shareWithDsp: ClientType[] = ['DSP'];
    const publisherType = { id: 2, typeName: 'Publisher' };
    test.each([
      [publisherType, false, shareWithDsp, false, true],
      [publisherType, false, shareWithDsp, true, true],
      [publisherType, false, [], true, false],
      [{ id: 3, typeName: 'Advertiser' }, false, shareWithDsp, false, false],
      [publisherType, true, shareWithDsp, false, false],
    ])(
      'Returns %p when participantTypes is %p, DSPChecked is %p, sharedTypes is %p, and completedRecommendations is %p',
      (participantTypes, dspChecked, sharedTypes, completedRecommendations, expected) => {
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
