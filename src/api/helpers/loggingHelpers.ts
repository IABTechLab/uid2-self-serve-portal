import { Request } from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';

import { SSP_APP_NAME, SSP_IS_DEVELOPMENT } from '../envars';

export const traceFormat = winston.format.printf(({ timestamp, label, level, message, meta }) => {
  const basicString = `${timestamp} [${label}] ${level}: ${message}`;
  const requestDetails = meta
    ? ` [traceId=${meta.req.headers.traceId ?? ''}] metadata=${JSON.stringify(meta)}`
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

export const getLoggingMiddleware = () =>
  expressWinston.logger({
    winstonInstance: logger,
    headerBlacklist: headersToRedact,
  });

export const getErrorLoggingMiddleware = () =>
  expressWinston.logger({
    winstonInstance: errorLogger,
    headerBlacklist: headersToRedact,
  });

export interface TraceId {
  traceId: string;
  amazonTraceId: string;
}

export const getTraceId = (request: Request): TraceId => {
  return {
    traceId: request?.headers?.traceId?.toString() ?? '',
    amazonTraceId: request?.headers?.xAmznTraceId?.toString() ?? '',
  };
};
