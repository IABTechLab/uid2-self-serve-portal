import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { createResponseObject } from '../../../testHelpers/apiTestHelpers';
import { Participant, ParticipantStatus } from '../../entities/Participant';
import { SSP_ADMIN_SERVICE_BASE_URL } from '../../envars';
import { KeyPairDTO } from '../../services/adminServiceHelpers';
import { ParticipantRequest } from '../../services/participantsService';
import { handleGetParticipantKeyPairs } from './participantsKeyPairs';

const noKeyPairsSiteId = 10;
const singleKeyPairSiteId = 11;
const multipleKeyPairsSiteId = 12;
const disabledKeyPairSiteId = 13;

const singleKeyPair: KeyPairDTO[] = [
  {
    name: faker.company.buzzNoun(),
    siteId: singleKeyPairSiteId,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: false,
  },
];

const multipleKeyPairs: KeyPairDTO[] = [
  {
    name: faker.company.buzzNoun(),
    siteId: multipleKeyPairsSiteId,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: false,
  },
  {
    name: faker.company.buzzNoun(),
    siteId: multipleKeyPairsSiteId,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: false,
  },
];

const disabledKeyPair: KeyPairDTO[] = [
  {
    name: faker.company.buzzNoun(),
    siteId: disabledKeyPairSiteId,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: true,
  },
];

const handlers = [
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/${noKeyPairsSiteId}/client-side-keypairs`,
    () => {
      return HttpResponse.json([]);
    }
  ),
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/${singleKeyPairSiteId}/client-side-keypairs`,
    () => {
      return HttpResponse.json(singleKeyPair);
    }
  ),
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/${multipleKeyPairsSiteId}/client-side-keypairs`,
    () => {
      return HttpResponse.json(multipleKeyPairs);
    }
  ),
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/${disabledKeyPairSiteId}/client-side-keypairs`,
    () => {
      return HttpResponse.json(disabledKeyPair);
    }
  ),
];

const server = setupServer(...handlers);

describe('Get participant key pairs', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should return 400 when no site id', async () => {
    const participantObject = Participant.fromJson({
      name: 'test',
      id: 5,
      allowSharing: true,
      completedRecommendations: true,
      status: ParticipantStatus.Approved,
      apiRoles: [],
    });

    const participantRequest = {
      participant: participantObject,
    } as ParticipantRequest;

    const { res } = createResponseObject();

    await handleGetParticipantKeyPairs(participantRequest, res);

    expect(res.status).toHaveBeenLastCalledWith(400);
  });

  test.each([
    [noKeyPairsSiteId, []],
    [disabledKeyPairSiteId, []],
    [singleKeyPairSiteId, singleKeyPair],
    [multipleKeyPairsSiteId, multipleKeyPairs],
  ])('should return enabled keypairs on site id %p', async (siteId: number, keys: KeyPairDTO[]) => {
    const participantObject = Participant.fromJson({
      name: 'test',
      id: 5,
      allowSharing: true,
      completedRecommendations: true,
      status: ParticipantStatus.Approved,
      apiRoles: [],
      siteId,
    });

    const participantRequest = {
      participant: participantObject,
    } as ParticipantRequest;

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.send = jest.fn();
    res.status = jest.fn(() => res);
    const enabledKeys = keys.filter((key) => !key.disabled);

    await handleGetParticipantKeyPairs(participantRequest, res);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith(enabledKeys);
  });
});
