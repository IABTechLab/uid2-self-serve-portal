import { Participant } from '../entities/Participant';
import {
  canBeSharedWith,
  convertSiteToSharingSiteDTO,
  mapClientTypeToParticipantType,
} from '../helpers/siteConvertingHelpers';
import { AdminSiteDTO, ClientType } from '../services/adminServiceHelpers';

describe('Sharing Permission Helper Tests', () => {
  const participantTypes = [
    {
      id: 1,
      typeName: 'DSP',
    },
    {
      id: 2,
      typeName: 'Publisher',
    },
    {
      id: 3,
      typeName: 'Data Provider',
    },
    {
      id: 4,
      typeName: 'Advertiser',
    },
  ];

  describe('#mapClientTypeToParticipantType', () => {
    it('should map client type to participant type', () => {
      const clientTypes = ['DSP', 'PUBLISHER', 'DATA_PROVIDER', 'ADVERTISER'] as ClientType[];
      expect(mapClientTypeToParticipantType(clientTypes, participantTypes)).toEqual(
        participantTypes
      );
    });

    it('should drop invalid types', () => {
      const clientTypes = [
        'DSP',
        'PUBLISHER',
        'MAPPER',
        'DATA_PROVIDER',
        'ADVERTISER',
        'SHARER',
      ] as ClientType[];
      expect(mapClientTypeToParticipantType(clientTypes, participantTypes)).toEqual(
        participantTypes
      );
    });
  });

  describe('#convertSiteToAvailableParticipantDTO', () => {
    it('should convert site to availableParticipantDTO', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER'],
        clientTypes: ['PUBLISHER'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as AdminSiteDTO;
      const convertedType = convertSiteToSharingSiteDTO(site, []);
      expect(convertedType).toEqual({
        name: 'Test Site',
        id: 2,
        clientTypes: ['PUBLISHER'],
        canBeSharedWith: true,
      });
    });

    it('should use participant name from db if participant has portal account', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER'],
        clientTypes: ['PUBLISHER'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as AdminSiteDTO;
      const participant = {
        id: 100,
        name: 'Participant Name',
        siteId: 2,
        types: [
          {
            id: 2,
            typeName: 'Publisher',
          },
        ],
      } as Participant;
      const convertedType = convertSiteToSharingSiteDTO(site, [participant]);
      expect(convertedType).toEqual({
        clientTypes: ['PUBLISHER'],
        id: 2,
        name: 'Participant Name',
        canBeSharedWith: true,
      });
    });
  });

  describe('#canBeSharedWith', () => {
    it('should return true if site is DSP and has ID_READER', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['ID_READER'],
        clientTypes: ['DSP'],
        // eslint-disable-next-line camelcase
        client_count: 1,
        visible: true,
      } as AdminSiteDTO;
      expect(canBeSharedWith(site)).toBe(true);
    });

    it('should return true if site has SHARER role', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER'],
        clientTypes: ['PUBLISHER'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as AdminSiteDTO;
      expect(canBeSharedWith(site)).toBe(true);
    });

    it('should return false if site has ID_READER but is not a DSP', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['ID_READER'],
        clientTypes: ['PUBLISHER'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as AdminSiteDTO;
      expect(canBeSharedWith(site)).toBe(false);
    });

    it('should return false if site has OPTOUT role', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['OPTOUT'],
        clientTypes: ['DSP'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as AdminSiteDTO;
      expect(canBeSharedWith(site)).toBe(false);
    });
  });
});
