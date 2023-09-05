import { Participant } from '../entities/Participant';
import {
  convertSiteToAvailableParticipantDTO,
  hasSharerRole,
  mapClientTypeToParticipantType,
} from '../helpers/siteConvertingHelpers';
import { ClientType, SiteDTO } from '../services/adminServiceHelpers';

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
      } as SiteDTO;
      const convertedType = convertSiteToAvailableParticipantDTO(site, participantTypes, []);
      expect(convertedType).toEqual({
        name: 'Test Site',
        siteId: 2,
        types: [
          {
            id: 2,
            typeName: 'Publisher',
          },
        ],
      });
    });

    it('should return participant from db if participant has portal account', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER'],
        clientTypes: ['PUBLISHER'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as SiteDTO;
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
      const convertedType = convertSiteToAvailableParticipantDTO(site, participantTypes, [
        participant,
      ]);
      expect(convertedType).toEqual({
        name: 'Participant Name',
        siteId: 2,
        types: [
          {
            id: 2,
            typeName: 'Publisher',
          },
        ],
      });
    });
  });

  describe('#hasSharerRole', () => {
    it('should return true if site is DSP', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: [],
        clientTypes: ['DSP'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as SiteDTO;
      expect(hasSharerRole(site)).toBeTruthy();
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
      } as SiteDTO;
      expect(hasSharerRole(site)).toBeTruthy();
    });

    it('should return false if clientTypes are empty', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER', 'GENERATOR'],
        clientTypes: [],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as SiteDTO;
      expect(hasSharerRole(site)).toBeFalsy();
    });

    it('should return false if clientTypes not exists', () => {
      const site = {
        id: 2,
        name: 'Test Site',
        enabled: true,
        roles: ['SHARER', 'GENERATOR'],
        // eslint-disable-next-line camelcase
        client_count: 1,
      } as SiteDTO;
      expect(hasSharerRole(site)).toBeFalsy();
    });
  });
});
