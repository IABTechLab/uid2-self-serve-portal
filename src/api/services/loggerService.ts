import { Request } from 'express';
import { injectable } from 'inversify';
import winston from 'winston';

import { SSP_APP_NAME } from '../envars';
import { getTraceId, traceFormat, TraceId } from '../helpers/loggingHelpers';

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
    return [new winston.transports.Console()];
  }

  private info(message: string, traceId: TraceId) {
    this.logger.info(`${message}, [traceId=${traceId.traceId}]`);
  }

  private error(message: string, traceId: TraceId) {
    this.logger.error(`${message}, [traceId=${traceId.traceId}]`);
  }

  public getLogger(req: Request) {
    const traceId = getTraceId(req);
    return {
      info: (message: string) => this.info(message, traceId),
      error: (message: string) => this.error(message, traceId),
    };
  }
}
