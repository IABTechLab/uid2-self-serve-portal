import expressWinston from 'express-winston';
import winston from 'winston';
import LokiTransport from 'winston-loki';

import { SSP_APP_NAME, SSP_IS_DEVELOPMENT, SSP_LOKI_HOST } from '../envars';

const traceFormat = winston.format.printf(({ timestamp, label, level, message, meta }) => {
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
  return [
    new winston.transports.Console(),
    new LokiTransport({
      host: SSP_LOKI_HOST,
      labels: {
        app: SSP_APP_NAME,
      },
      format: loggerFormat(),
    }),
  ];
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
  info: (message: string, traceId: string) => logger.info(`${message}, [traceId=${traceId}]`),
};

const errorLoggerWrapper = {
  error: (message: string, traceId: string) =>
    errorLogger.error(`${message}, [traceId=${traceId}]`),
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
