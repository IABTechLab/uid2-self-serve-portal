import { Request } from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import { SSP_APP_NAME, SSP_IS_DEVELOPMENT } from '../envars';

export const traceFormat = winston.format.printf(({ timestamp, label, level, message, meta }) => {
  const basicString = `${timestamp} [${label}] ${level}: ${message}`;
  const metaWithTypes = meta as {
    req?: {
      headers?: {
        traceId?: string;
        [key: string]: unknown;
      };
    };
    [key: string]: unknown;
  };

  const requestDetails = meta
    ? ` [traceId=${metaWithTypes?.req?.headers?.traceId ?? ''}] metadata=${JSON.stringify(meta)}`
    : '';
  return basicString + requestDetails;
});

const loggerFormat = () => {
  return winston.format.combine(
    winston.format.label({ label: SSP_APP_NAME }),
    winston.format.timestamp(),
    winston.format.json(),
    traceFormat
  );
};

const getTransports = () => {
  return [new winston.transports.Console()];
};

const logger = winston.createLogger({
  transports: getTransports(),
  format: loggerFormat(),
});

const errorLogger = winston.createLogger({
  transports: getTransports(),
  format: winston.format.combine(
    winston.format.errors({ stack: SSP_IS_DEVELOPMENT }), // only show stack in development
    winston.format.label({ label: SSP_APP_NAME }),
    winston.format.timestamp(),
    winston.format.json(),
    traceFormat
  ),
});

const infoLoggerWrapper = {
  info: (message: string, traceId: TraceId) => logger.info(`${message}, [traceId=${traceId}]`),
};

const errorLoggerWrapper = {
  error: (message: string, traceId: TraceId) =>
    errorLogger.error(`${message}, [traceId=${traceId.traceId}]`),
};

export const getLoggers = () => {
  return {
    logger,
    infoLogger: infoLoggerWrapper,
    errorLogger: errorLoggerWrapper,
  };
};

const headersToRedact = ['authorization'];

export const getErrorLoggingMiddleware = () =>
  expressWinston.logger({
    winstonInstance: errorLogger,
    headerBlacklist: headersToRedact,
  });

export interface TraceId {
  traceId: string;
  uidTraceId: string;
}

export const getTraceId = (request: Request): TraceId => {
  const traceId = request?.headers?.traceId?.toString() || '';
	const uidTraceId = (request?.headers?.['x-amzn-trace-id'] as string | undefined) ?? traceId ?? '';
  return {
    traceId,
    uidTraceId
  };
};
