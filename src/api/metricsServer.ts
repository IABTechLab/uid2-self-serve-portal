import express from 'express';
import promClient from 'prom-client';
import { Logger } from 'winston';

export const DEFAULT_METRICS_PORT = 9082;

/**
 * Serves the Prometheus registry on its own listener, separate from the public API.
 *
 * The public API is reachable through nginx on port 80, so `/metrics` must not be registered there.
 * This listener is only reachable on the container's `prometheus` port (9082), which is not exposed by
 * the Kubernetes Service or the load balancer target group.
 */
export function startMetricsServer(logger: Logger, port: number = DEFAULT_METRICS_PORT) {
  const metricsApp = express();

  metricsApp.get('/metrics', async (_req, res) => {
    res.writeHead(200, { 'Content-Type': promClient.register.contentType });
    res.end(await promClient.register.metrics());
  });

  return metricsApp.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}.`);
  });
}
