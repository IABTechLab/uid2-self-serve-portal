import { ClientType } from '../../../api/services/adminServiceHelpers';
import { publisherHasUncheckedDSP } from './bulkAddPermissionsHelpers';

describe('Bulk add permission helper tests', () => {
  describe('#publisherHasUncheckedDSP', () => {
    const dspSharedType: ClientType[] = ['DSP'];
    const publisherParticipantType = { id: 2, typeName: 'Publisher' };

    test.each([
      [true, publisherParticipantType, false, dspSharedType, false],
      [true, publisherParticipantType, false, dspSharedType, true],
      [false, publisherParticipantType, false, [], true],
      [false, { id: 3, typeName: 'Advertiser' }, false, dspSharedType, false],
      [false, publisherParticipantType, true, dspSharedType, false],
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
