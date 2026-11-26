import { jest } from '@jest/globals';
import request from 'supertest';
import winston from 'winston';

import useTestServer, { api } from './utils';

type AuditEntry = { log_type?: string; endpoint?: string; actor: string };

// Token verification is mocked in the test server, so an unsigned token with a decodable
// payload is enough for the audit log to record the user as the actor.
const encode = (part: Record<string, unknown>) =>
  Buffer.from(JSON.stringify(part)).toString('base64url');
const userToken = `Bearer ${encode({ alg: 'none' })}.${encode({
  sub: 'user-sub',
  email: 'test_user@example.com',
})}.`;

const actorOf = (entry: AuditEntry) => JSON.parse(entry.actor) as Record<string, unknown>;

describe('privilege level in audit logs from the running api', () => {
  useTestServer();
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

  it('logs the privilege level on the actor for an authenticated request', async () => {
    await request(api).get('/api/route-that-does-not-exist').set('Authorization', userToken);
    const actor = actorOf(auditEntryFor('/api/route-that-does-not-exist'));
    expect(actor.privilege_level).toBe('standard');
    expect(actor.email).toBe('test_user@example.com');
  });

  it('omits the privilege level for a path that bypasses authentication', async () => {
    await request(api).get('/api/health');
    expect(actorOf(auditEntryFor('/api/health'))).not.toHaveProperty('privilege_level');
  });
});
