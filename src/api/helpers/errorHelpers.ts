import { Request, Response } from 'express';

import { getTraceId } from './loggingHelpers';

export function errorResponse(
  req: Request,
  res: Response,
  errorCode: number,
  response?: { message: string } & Record<string, unknown>
) {
  const traceId = getTraceId(req);

  return res.status(errorCode).json({
    errorHash: traceId,
    ...response,
  });
}

export const siteIdNotSetError = (req: Request, res: Response) =>
  errorResponse(req, res, 400, { message: 'Site id is not set' });
