import axios, { InternalAxiosRequestConfig } from 'axios';

import { setAuthToken } from './axios';

describe('setAuthToken', () => {
  let useSpy: jest.SpyInstance;
  let ejectSpy: jest.SpyInstance;
  let capturedHandler: ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) | undefined;

  beforeEach(() => {
    ejectSpy = jest.spyOn(axios.interceptors.request, 'eject');
    useSpy = jest.spyOn(axios.interceptors.request, 'use').mockImplementation((handler) => {
      capturedHandler = handler as (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
      return 1;
    });
  });

  afterEach(() => {
    useSpy.mockRestore();
    ejectSpy.mockRestore();
    capturedHandler = undefined;
  });

  it('attaches a Bearer token to the Authorization header', () => {
    setAuthToken('test-token-123');
    const config = { headers: {} } as InternalAxiosRequestConfig;
    const result = capturedHandler!(config);
    expect(result.headers.Authorization).toBe('Bearer test-token-123');
  });

  it('sets Authorization to undefined when no token is provided', () => {
    setAuthToken(undefined);
    const config = { headers: {} } as InternalAxiosRequestConfig;
    const result = capturedHandler!(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('does not store the token in localStorage', () => {
    setAuthToken('secret-token');
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('ejects the previous interceptor when called again', () => {
    setAuthToken('first-token');
    const firstInterceptorId = useSpy.mock.results[0].value as number;
    setAuthToken('second-token');
    expect(ejectSpy).toHaveBeenCalledWith(firstInterceptorId);
  });
});
