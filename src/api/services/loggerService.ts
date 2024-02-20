import { injectable } from 'inversify';
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

@injectable()
export class LoggerService {
  private logger: winston.Logger;
  private errorLogger: winston.Logger;

  constructor() {
    this.logger = this.createLogger();
    this.errorLogger = this.createErrorLogger();
  }

  private createLogger(): winston.Logger {
    return winston.createLogger({
      transports: this.getTransports(),
      format: this.loggerFormat(),
    });
  }

  private createErrorLogger(): winston.Logger {
    return winston.createLogger({
      transports: this.getTransports(),
      format: this.errorLoggerFormat(),
    });
  }

  private loggerFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.label({ label: SSP_APP_NAME }),
      winston.format.timestamp(),
      winston.format.json(),
      traceFormat
    );
  }

  private errorLoggerFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.errors({ stack: SSP_IS_DEVELOPMENT }), // only show stack in development
      winston.format.label({ label: SSP_APP_NAME }),
      winston.format.timestamp(),
      winston.format.json(),
      traceFormat
    );
  }

  private getTransports(): winston.transport[] {
    return [
      new winston.transports.Console(),
      new LokiTransport({
        host: SSP_LOKI_HOST,
        labels: {
          app: SSP_APP_NAME,
        },
        format: this.loggerFormat(),
      }),
    ];
  }

  private info(message: string, traceId: string) {
    this.logger.info(`${message}, [traceId=${traceId}]`);
  }

  private error(message: string, traceId: string) {
    this.logger.error(`${message}, [traceId=${traceId}]`);
  }

  public getLoggers() {
    return {
      logger: this.logger,
      infoLogger: {
        info: this.info.bind(this),
      },
      errorLogger: {
        error: this.error.bind(this),
      },
    };
  }

  public getLogger(): winston.Logger {
    return this.logger;
  }

  public getErrorLogger(): winston.Logger {
    return this.errorLogger;
  }
}
