import axios from 'axios';
import { NextFunction, Request, Response, response } from 'express';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { TestConfigure } from '../../database/TestSelfServeDatabase';
import { Participant, ParticipantStatus } from '../entities/Participant';
import { User, UserRole } from '../entities/User';
import { SSP_ADMIN_SERVICE_BASE_URL } from '../envars';
import { KeyPairDTO } from '../services/adminServiceHelpers';
import { ParticipantRequest } from '../services/participantsService';
import { getParticipantKeyPairs, getParticipantUsers } from './participantsRouter';

const oneKeyPair: KeyPairDTO[] = [
  {
    name: 'test',
    siteId: 999,
    subscriptionId: 'MovTPCPo4T',
    publicKey:
      'UID2-X-L-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBSfiggI3wcXR8atoC11Dr5YoysLP0az1g1ZsWf/TfDtmgEaI7OLlqwkS38r1q3c5n3LyBg8+niOi87lYYNoCcQ==',
    created: 43214213,
    disabled: false,
  },
];

const multipleKeyPairs: KeyPairDTO[] = [
  {
    name: 'test',
    siteId: 999,
    subscriptionId: 'MovTPCPo4T',
    publicKey:
      'UID2-X-L-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBSfiggI3wcXR8atoC11Dr5YoysLP0az1g1ZsWf/TfDtmgEaI7OLlqwkS38r1q3c5n3LyBg8+niOi87lYYNoCcQ==',
    created: 314234312,
    disabled: false,
  },
  {
    name: 'test',
    siteId: 999,
    subscriptionId: 'V5sVHDKRxT',
    publicKey:
      'UID2-X-L-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE24CNfSAb/UMUZHxfI+6jxpF8fwRIBcF6Ko0TlsqqxdTc96qHh6/YGoMQTXQBWPE7R3E+KpvD3/voSOw47qq7xQ==',
    created: 4314321432,
    disabled: true,
  },
];

const handlers = [
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/10/client-side-keypairs`,
    ({ request, params, cookies }) => {
      return HttpResponse.json([]);
    }
  ),
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/11/client-side-keypairs`,
    ({ request, params, cookies }) => {
      return HttpResponse.json(oneKeyPair);
    }
  ),
  http.get(
    `${SSP_ADMIN_SERVICE_BASE_URL}/api/v2/sites/12/client-side-keypairs`,
    ({ request, params, cookies }) => {
      return HttpResponse.json(multipleKeyPairs);
    }
  ),
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

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.send = jest.fn();
    res.status = jest.fn(() => res);

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

describe('#getParticipantUsers', () => {
  test('return empty list when no users', async () => {
    await TestConfigure();

    // Insert Participant
    const participantObject = Participant.fromJson({
      name: 'test',
      allowSharing: true,
      completedRecommendations: true,
      status: ParticipantStatus.Approved,
      apiRoles: [],
      siteId: 5,
    });

    await Participant.query().insert(participantObject);

    // Setup query
    const participantRequest = {
      participant: participantObject,
    } as ParticipantRequest;

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.send = jest.fn();
    res.status = jest.fn(() => res);

    await getParticipantUsers(participantRequest, res);

    expect(res.status).lastCalledWith(200);
    expect(res.json).lastCalledWith([]);
  });

  test('return list with one user', async () => {
    await TestConfigure();

    const participantDb = await Participant.query().insert({
      id: 10,
      name: 'test',
      allowSharing: true,
      completedRecommendations: true,
      status: ParticipantStatus.Approved,
      apiRoles: [],
      siteId: 10,
    });

    const relatedUser = await User.query().insert({
      id: 5,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      location: 'Sydney, AU',
      phone: '+61298765432',
      role: UserRole.DA,
      acceptedTerms: false,
      participantId: 10,
    });

    const unrelatedParticipant = await Participant.query().insert({
      id: 11,
      name: 'test',
      allowSharing: true,
      completedRecommendations: true,
      status: ParticipantStatus.Approved,
      apiRoles: [],
      siteId: 11,
    });

    const unrelatedUser = await User.query().insert({
      id: 6,
      email: 'test2@example.com',
      firstName: 'Test2',
      lastName: 'User2',
      location: 'Sydney, AU',
      phone: '+61298765432',
      role: UserRole.DA,
      acceptedTerms: false,
      participantId: 11,
    });

    // Setup query
    const participantRequest = {
      participant: participantDb,
    } as ParticipantRequest;

    const res = {} as unknown as Response;
    const json = jest.fn();
    res.json = json;
    res.send = jest.fn();
    res.status = jest.fn(() => res);

    await getParticipantUsers(participantRequest, res);
    const receivedUsers = json.mock.calls.pop()[0] as User[];

    expect(res.status).lastCalledWith(200);
    expect(receivedUsers.map((user) => user.id).sort()).toEqual([relatedUser.id].sort());
  });
});
