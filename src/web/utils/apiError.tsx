/*
 * Backend errors may return an `errorHash` that can help correlate the logs
 * with the user reported issues.
 */
export class ApiError extends Error {
  errorHash?: string;
  statusCode?: number;
  constructor(message: string, opts: { errorHash?: string; statusCode?: number }) {
    super(message);
    this.errorHash = opts.errorHash;
    this.statusCode = opts.statusCode;
    this.name = 'ApiError';
  }
}
