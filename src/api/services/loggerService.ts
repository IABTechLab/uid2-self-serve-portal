import { Request } from 'express';
import { injectable } from 'inversify';
import winston from 'winston';
import LokiTransport from 'winston-loki';

import { SSP_APP_NAME, SSP_LOKI_HOST } from '../envars';
import { getTraceId, traceFormat } from '../helpers/loggingHelpers';

@injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    return winston.createLogger({
      transports: this.getTransports(),
      format: this.loggerFormat(),
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

  public getLogger(req: Request) {
    const traceId = getTraceId(req);
    return {
      info: (message: string) => this.info(message, traceId),
      error: (message: string) => this.error(message, traceId),
    };
  }
}
