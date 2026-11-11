import express from 'express';
import promClient from 'prom-client';
import { Logger } from 'winston';

export function startMetricsServer(logger: Logger, port: number) {
  const metricsApp = express();

  metricsApp.get('/metrics', async (_req, res) => {
    res.writeHead(200, { 'Content-Type': promClient.register.contentType });
    res.end(await promClient.register.metrics());
  });

  return metricsApp.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}.`);
  });
}
