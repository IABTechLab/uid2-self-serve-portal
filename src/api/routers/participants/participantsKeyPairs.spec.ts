import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { createResponseObject } from '../../../testHelpers/apiTestHelpers';
import { Participant, ParticipantStatus } from '../../entities/Participant';
import { SSP_ADMIN_SERVICE_BASE_URL } from '../../envars';
import { KeyPairDTO } from '../../services/adminServiceHelpers';
import { ParticipantRequest } from '../../services/participantsService';
import { getParticipantKeyPairs } from './participantsKeyPairs';

const oneKeyPair: KeyPairDTO[] = [
  {
    name: faker.company.buzzNoun(),
    siteId: 11,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: false,
  },
];

const multipleKeyPairs: KeyPairDTO[] = [
  {
    name: faker.company.buzzNoun(),
    siteId: 12,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: false,
  },
  {
    name: faker.company.buzzNoun(),
    siteId: 12,
    subscriptionId: faker.string.alphanumeric(8),
    publicKey: faker.string.alphanumeric(140),
    created: faker.number.int(50000000),
    disabled: true,
  },
];

const handlers = [
  http.get(`${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/10/client-side-keypairs`, () => {
    return HttpResponse.json([]);
  }),
  http.get(`${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/11/client-side-keypairs`, () => {
    return HttpResponse.json(oneKeyPair);
  }),
  http.get(`${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/12/client-side-keypairs`, () => {
    return HttpResponse.json(multipleKeyPairs);
  }),
];

const server = setupServer(...handlers);

describe('#getParticipantKeyPairs', () => {
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

    await getParticipantKeyPairs(participantRequest, res);

    expect(res.status).lastCalledWith(400);
    expect(res.send).lastCalledWith('Site id is not set');
  });

  test.each([
    [10, []],
    [11, oneKeyPair],
    [12, multipleKeyPairs],
  ])('returns 200 %# keypairs on site id %p', async (siteId: number, keys: KeyPairDTO[]) => {
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

    await getParticipantKeyPairs(participantRequest, res);

    expect(res.status).lastCalledWith(200);
    expect(res.json).lastCalledWith(keys);
  });
});
