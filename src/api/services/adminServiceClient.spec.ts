import winston from 'winston';

import { auditTraceFormat, convertToSnakeCase } from '../helpers/auditLogging';

describe('audit log format', () => {
  it('should format audit log correctly for a GET request', () => {
    const mockRequest = {
      headers: {
        'if-none-match': 'W/"f4-zeVlw5GXZ45po6l3PFPfpXTJNZg"',
        'accept-language': 'en-US,en;q=0.9',
        'accept-encoding': 'gzip, deflate, br, zstd',
        referer: 'http://localhost:3000/participant/7/apiKeys',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        accept: 'application/json, text/plain, */*',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyaHd4NGhkS09hMThtaThHakplQko4V2NLaU42X3pIbzNoX1hNUTg2Y2xBIn0.eyJleHAiOjE3NDcwMjkwODQsImlhdCI6MTc0NzAyNzI4NCwiYXV0aF90aW1lIjoxNzQ3MDI0MTk0LCJqdGkiOiJmMzkyMDQ3OC1kNTJkLTRiMTctYWUzZC1iMGRkMDZkMzA4YTciLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjE4MDgwL3JlYWxtcy9zZWxmLXNlcnZlLXBvcnRhbCIsImF1ZCI6WyJzZWxmX3NlcnZlX3BvcnRhbF9hcGlzIiwicmVhbG0tbWFuYWdlbWVudCIsImJyb2tlciIsImFjY291bnQiXSwic3ViIjoiNzNkZjI2NGUtOGIyMi00MjgwLWI3M2ItN2FjMTkwOTQwMjY4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2VsZl9zZXJ2ZV9wb3J0YWxfd2ViIiwic2lkIjoiZTk2N2E4OTQtY2ZjOC00NWIwLTlkODYtZGZkZGI4MzNhMzRhIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zZWxmLXNlcnZlLXBvcnRhbCIsImFwcC1hZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIiwiYXBwLXVzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJzZWxmX3NlcnZlX3BvcnRhbF9hcGlzIjp7InJvbGVzIjpbImFwaS1wYXJ0aWNpcGFudC1hZG1pbiIsImFwaS11c2VyIiwidW1hX3Byb3RlY3Rpb24iLCJhcGktYWRtaW4iLCJhcGktcGFydGljaXBhbnQtbWVtYmVyIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJpYW5hbGV4bmFyYUBnbWFpbC5jb20iLCJlbWFpbCI6ImlhbmFsZXhuYXJhQGdtYWlsLmNvbSJ9',
        'sec-ch-ua-platform': '"Windows"',
        connection: 'close',
        host: 'localhost:3000',
        traceId: 'b96aaad6-e8ba-4697-9273-6ab7607af102',
      },
      query: {},
      method: 'GET',
      path: '/api/participants/7/apiRoles',
      ip: '::1',
    } as unknown as Request;

    const expectedAuditLog = {
      timestamp: '2025-05-12T05:21:36.948Z',
      logType: 'audit',
      source: 'ssportal-dev',
      status: 304,
      method: 'GET',
      endpoint: '/api/participants/7/apiRoles',
      traceId: 'b96aaad6-e8ba-4697-9273-6ab7607af102',
      xAmznTraceId: '',
      actor: JSON.stringify(
        convertToSnakeCase({
          ip: '::1',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          type: 'user',
          email: 'ianalexnara@gmail.com',
          sub: '73df264e-8b22-4280-b73b-7ac190940268',
          roles: [
            'api-participant-admin',
            'api-user',
            'uma_protection',
            'api-admin',
            'api-participant-member',
          ],
        })
      ),
      queryParams: {},
      requestBody: {},
    };

    const mockDate = new Date('2025-05-12T05:21:36.948Z');
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const info = {
      timestamp: mockDate.toISOString(),
      level: 'info',
      message: 'Audit log entry',
      meta: {
        req: mockRequest,
        res: { statusCode: 304 },
      },
    } as winston.Logform.TransformableInfo;

    const result = auditTraceFormat.transform(info);
    if (typeof result === 'boolean') {
      throw new Error('Transform returned boolean instead of string');
    }
    const auditLog = JSON.parse((result as { message: string }).message) as typeof expectedAuditLog;
    expect(auditLog).toEqual(convertToSnakeCase(expectedAuditLog));

    jest.useRealTimers();
  });
});
