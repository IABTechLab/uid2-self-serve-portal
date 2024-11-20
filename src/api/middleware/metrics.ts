import express, { RequestHandler } from 'express';
import listEndpoints from 'express-list-endpoints';
import promBundle, { NormalizePathFn } from 'express-prom-bundle';
import url from 'url';
import UrlPattern from 'url-pattern';
import { Logger } from 'winston';

import { SSP_APP_NAME } from '../envars';

type Options = {
  isNormalizePathEnabled: boolean;
};

type Route = {
  methods: string[];
  path: string;
  pattern: UrlPattern;
};

export const withoutTrailingSlash = (path: string) => {
  // Express routes don't include a trailing slash unless it's actually just `/` path, then it stays
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

export const toRoute = (path: string, methods: string[]) => {
  const withoutSlash = withoutTrailingSlash(path);
  return {
    path: withoutSlash,
    methods: methods.map((method) => method.toUpperCase()),
    pattern: new UrlPattern(withoutSlash),
  };
};

export const scrapeRoutes = (req: express.Request, logger: Logger) => {
  // Scrape all the paths registered with express on the first recording of metrics. These paths will later be used
  // to ensure we don't use unknown paths (ie spam calls) in metric labels and don't overwhelm Prometheus.
  // Unfortunately, this doesn't include static paths since they are not registered with Express. If desired,
  // we could add them by recursively listing /public.
  try {
    return listEndpoints(req.app as express.Express)
      .filter((route) => route.path !== '/*' && route.path !== '*' && !route.path.includes(' '))
      .map((route) => toRoute(route.path, route.methods));
  } catch (e) {
    logger.error(`unable to capture route for prom-metrics: ${e}`);
    return [];
  }
};

export const makeNormalizePath =
  (isNormalizePathEnabled: boolean, allRoutes: Route[], logger: Logger): NormalizePathFn =>
  (req, _opts) => {
    if (!isNormalizePathEnabled) {
      return req.url;
    }

    const parsedPath = url.parse(req.originalUrl || req.url).pathname || req.url;
    const path = withoutTrailingSlash(parsedPath);

    const matchingRoute = allRoutes.find((route) => {
      if (!route.methods.includes(req.method.toUpperCase())) {
        return false;
      }

      // match will be null if it doesn't fit the pattern and will be some object depending on path params if it does
      // e.g. path /abc/123 will match route /abc/:id with object {id: 123} but will return null for route /xyz/:id
      try {
        return route.pattern.match(path) !== null;
      } catch (e: unknown) {
        logger.error(`Unable to perform regex match on path: ${e}`);
        return false;
      }
    });

    if (!matchingRoute) {
      return 'unmatched-url';
    }

    return matchingRoute.path;
  };

const makeMetricsApiMiddleware = (options: Options, logger: Logger) => {
  const { isNormalizePathEnabled } = options;
  let metricsMiddleware: promBundle.Middleware;
  const handler: RequestHandler = (req, res, next) => {
    if (!metricsMiddleware) {
      const allRoutes = scrapeRoutes(req, logger);
      metricsMiddleware = promBundle({
        includeMethod: true,
        includePath: true,
        autoregister: false,
        customLabels: {
          application: SSP_APP_NAME,
        },
        buckets: [0.03, 0.3, 1, 1.5, 3, 5, 10],
        normalizePath: makeNormalizePath(isNormalizePathEnabled, allRoutes, logger),
      });
    }

    metricsMiddleware(req, res, next);
  };

  return handler;
};

export default makeMetricsApiMiddleware;
