import { jest } from '@jest/globals';
import request from 'supertest';
import winston from 'winston';

import useTestServer, { api } from './utils';

type AuditEntry = { log_type?: string; endpoint?: string; privilege_level?: string };

describe('privilege level in audit logs from the running api', () => {
  const withToken = useTestServer();
  let auditEntries: AuditEntry[];

  beforeEach(() => {
    auditEntries = [];
    jest
      .spyOn(winston.transports.Console.prototype, 'log')
      .mockImplementation((...args: unknown[]) => {
        const message = (args[0] as Record<symbol, unknown>)[Symbol.for('message')];
        if (typeof message === 'string') {
          try {
            const entry = JSON.parse(message) as AuditEntry;
            if (entry.log_type === 'audit') auditEntries.push(entry);
          } catch {
            // Not an audit entry.
          }
        }
        (args[1] as (() => void) | undefined)?.();
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const auditEntryFor = (endpoint: string) => {
    const matching = auditEntries.filter((entry) => entry.endpoint === endpoint);
    expect(matching).toHaveLength(1);
    return matching[0];
  };

  it('logs the privilege level for an authenticated request', async () => {
    await withToken(request(api).get('/api/route-that-does-not-exist'));
    expect(auditEntryFor('/api/route-that-does-not-exist').privilege_level).toBe('standard');
  });

  it('omits the privilege level for a path that bypasses authentication', async () => {
    await request(api).get('/api/health');
    expect(auditEntryFor('/api/health').privilege_level).toBeUndefined();
  });
});
