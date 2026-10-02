import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { TraceId } from '../helpers/loggingHelpers';

type CapturedCreate = {
  baseURL?: string;
  interceptors: { request: { use: jest.Mock } };
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

const createdInstances: CapturedCreate[] = [];

const axiosCreateMock = jest.fn((config?: { baseURL?: string }) => {
  const instance: CapturedCreate = {
    baseURL: config?.baseURL,
    interceptors: { request: { use: jest.fn() } },
    get: jest.fn(async () => ({ data: [] })),
    post: jest.fn(async () => ({ data: {} })),
    put: jest.fn(async () => ({ data: {} })),
    delete: jest.fn(async () => ({ data: {} })),
  };
  createdInstances.push(instance);
  return instance;
});

jest.unstable_mockModule('axios', () => {
  const AxiosError = class extends Error {};
  return {
    default: {
      create: axiosCreateMock,
      AxiosError,
    },
    AxiosError,
  };
});

const traceId: TraceId = { traceId: 't', uidTraceId: 't' };

describe('adminServiceClient honours SSP_ADMIN_SERVICE_BASE_URL per deploy', () => {
  const env = process.env as Record<string, string | undefined>;
  const originalUrl = env.SSP_ADMIN_SERVICE_BASE_URL;
  const originalAuthDisabled = env.SSP_OKTA_AUTH_DISABLED;

  beforeEach(() => {
    axiosCreateMock.mockClear();
    createdInstances.length = 0;
    // Skip okta token-fetch branch so the test focuses on the admin-service URL.
    env.SSP_OKTA_AUTH_DISABLED = 'true';
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete env.SSP_ADMIN_SERVICE_BASE_URL;
    } else {
      env.SSP_ADMIN_SERVICE_BASE_URL = originalUrl;
    }
    if (originalAuthDisabled === undefined) {
      delete env.SSP_OKTA_AUTH_DISABLED;
    } else {
      env.SSP_OKTA_AUTH_DISABLED = originalAuthDisabled;
    }
  });

  it('uses the EUID admin base URL when SSP_ADMIN_SERVICE_BASE_URL points there', async () => {
    env.SSP_ADMIN_SERVICE_BASE_URL = 'http://euid-admin.example';

    jest.resetModules();
    const { getSiteList } = await import('../services/adminServiceClient');
    await getSiteList(traceId);

    // adminServiceClient creates two axios instances at module load:
    //   - oktaClient  (baseURL = SSP_OKTA_AUTH_SERVER_URL)
    //   - adminServiceClient (baseURL = SSP_ADMIN_SERVICE_BASE_URL)
    const adminInstance = createdInstances.find(
      (inst) => inst.baseURL === 'http://euid-admin.example'
    );
    expect(adminInstance).toBeDefined();
    expect(adminInstance!.get).toHaveBeenCalledWith('/api/site/list', expect.any(Object));
  });

  it('uses the UID2 admin base URL when SSP_ADMIN_SERVICE_BASE_URL points there', async () => {
    env.SSP_ADMIN_SERVICE_BASE_URL = 'http://uid2-admin.example';

    jest.resetModules();
    const { getSiteList } = await import('../services/adminServiceClient');
    await getSiteList(traceId);

    const adminInstance = createdInstances.find(
      (inst) => inst.baseURL === 'http://uid2-admin.example'
    );
    expect(adminInstance).toBeDefined();
    expect(adminInstance!.get).toHaveBeenCalledWith('/api/site/list', expect.any(Object));

    // And ensure we did NOT dial the EUID URL.
    expect(createdInstances.find((inst) => inst.baseURL === 'http://euid-admin.example')).toBeUndefined();
  });
});
