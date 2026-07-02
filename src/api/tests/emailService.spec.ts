import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { TraceId } from '../helpers/loggingHelpers';
import { EmailArgs } from '../services/emailTypes';

const sendGridMock = jest.fn<(args: EmailArgs, traceId: TraceId) => Promise<void>>();
const nodemailerMock = jest.fn<(args: EmailArgs) => Promise<void>>();

jest.unstable_mockModule('../services/sendGridService', () => ({
  sendEmail: sendGridMock,
}));

jest.unstable_mockModule('../services/nodemailerService', () => ({
  sendEmail: nodemailerMock,
}));

const traceId: TraceId = { traceId: 'test-trace', uidTraceId: 'test-trace' };

const baseArgs: EmailArgs = {
  to: 'tam@example.com',
  subject: 'hi',
  template: 'invitation',
  templateData: { foo: 'bar' },
};

describe('emailService sendEmail', () => {
  const env = process.env as Record<string, string | undefined>;
  const originalIdentity = env.SSP_PORTAL_IDENTITY;
  const originalNodeEnv = env.NODE_ENV;

  beforeEach(() => {
    sendGridMock.mockReset().mockResolvedValue(undefined);
    nodemailerMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    if (originalIdentity === undefined) {
      delete env.SSP_PORTAL_IDENTITY;
    } else {
      env.SSP_PORTAL_IDENTITY = originalIdentity;
    }
    if (originalNodeEnv === undefined) {
      delete env.NODE_ENV;
    } else {
      env.NODE_ENV = originalNodeEnv;
    }
  });

  describe('when SSP_PORTAL_IDENTITY is EUID', () => {
    beforeEach(() => {
      env.SSP_PORTAL_IDENTITY = 'EUID';
    });

    it('does NOT invoke SendGrid in production', async () => {
      env.NODE_ENV = 'production';
      const { createEmailService } = await import('../services/emailService');
      const { sendEmail } = createEmailService();
      await sendEmail(baseArgs, traceId);
      expect(sendGridMock).not.toHaveBeenCalled();
    });

    it('does NOT invoke Nodemailer outside production', async () => {
      env.NODE_ENV = 'development';
      const { createEmailService } = await import('../services/emailService');
      const { sendEmail } = createEmailService();
      await sendEmail(baseArgs, traceId);
      expect(nodemailerMock).not.toHaveBeenCalled();
    });

    it('returns a "skipped" indicator with reason mentioning EUID MVP', async () => {
      const { createEmailService } = await import('../services/emailService');
      const { sendEmail } = createEmailService();
      const result = await sendEmail(baseArgs, traceId);
      expect(result).toMatchObject({ status: 'skipped', reason: expect.stringMatching(/EUID MVP/) });
    });
  });

  describe('when SSP_PORTAL_IDENTITY is unset (UID2 default)', () => {
    beforeEach(() => {
      delete env.SSP_PORTAL_IDENTITY;
    });

    it('invokes SendGrid in production', async () => {
      env.NODE_ENV = 'production';
      const { createEmailService } = await import('../services/emailService');
      const { sendEmail } = createEmailService();
      await sendEmail(baseArgs, traceId);
      expect(sendGridMock).toHaveBeenCalledTimes(1);
      expect(nodemailerMock).not.toHaveBeenCalled();
    });

    it('invokes Nodemailer outside production', async () => {
      env.NODE_ENV = 'development';
      const { createEmailService } = await import('../services/emailService');
      const { sendEmail } = createEmailService();
      await sendEmail(baseArgs, traceId);
      expect(nodemailerMock).toHaveBeenCalledTimes(1);
      expect(sendGridMock).not.toHaveBeenCalled();
    });
  });
});
