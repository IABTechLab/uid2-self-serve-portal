import express, { RequestHandler } from 'express';
import listEndpoints from 'express-list-endpoints';
import promBundle, { NormalizePathFn } from 'express-prom-bundle';
import url from 'url';
import UrlPattern from 'url-pattern';
import { Logger } from 'winston';

import { SSP_APP_NAME } from '../envars';

type Options = {
  isNormalizePathEnabled?: boolean;
  discardUnmatched?: boolean;
  urlPatternMaker?: (path: string) => string;
};

const captureAllRoutes = ({ urlPatternMaker }: Options, app: express.Express, logger: Logger) => {
  const allRoutes = listEndpoints(app);
  const filteredRoutes = allRoutes.filter(
    (route) => route.path !== '/*' && route.path !== '*' && !route.path.includes(' ')
  );

  return filteredRoutes.map((route) => {
    const path = route.path.endsWith('/') ? route.path.replace(/\/$/, '') : route.path;

    logger.log('debug', `Route found: ${route.path} - ${JSON.stringify(route)}`);

    // NOTE: urlPatternMaker has to create an UrlPattern compatible object.
    const pattern = urlPatternMaker
      ? urlPatternMaker(route.path)
      : new UrlPattern(route.path, {
          segmentNameCharset: 'a-zA-Z0-9_-',
        }).toString();

    if (!pattern) {
      logger.log('debug', 'skipping route due to empty path');
    }

    return { ...route, path: pattern || path };
  });
};

const makeMetricsApiMiddleware = (options: Options, logger: Logger) => {
  const { isNormalizePathEnabled, discardUnmatched } = options;
  const allRoutes = [] as { methods: string[]; path: string; pattern?: UrlPattern }[];

  const normalizePath: NormalizePathFn = (req, _opts) => {
    if (!isNormalizePathEnabled) {
      return req.url;
    }

    const path = (() => {
      const parsedPath = url.parse(req.originalUrl || req.url).pathname || req.url;
      if (parsedPath.endsWith('/')) {
        // Remove trailing slash
        return parsedPath.replace(/\/$/, '');
      }
      return parsedPath;
    })();

    const pattern = allRoutes.filter((route) => {
      if (route.methods.indexOf(req.method) === -1) {
        return false;
      }
      try {
        if (route.path.match(path)) {
          return true;
        }
      } catch (e: unknown) {
        console.error('Invalid path', e);
        return false;
      }

      return false;
    })[0]?.pattern;

    if (discardUnmatched && !pattern) {
      return '';
    }

    return pattern?.stringify() || path || '';
  };

  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    autoregister: false,
    customLabels: {
      application: SSP_APP_NAME,
    },
    buckets: [0.03, 0.3, 1, 1.5, 3, 5, 10],
    normalizePath,
  });

  const handler: RequestHandler = (req, res, next) => {
    if (allRoutes.length === 0) {
      try {
        captureAllRoutes(options, req.app as express.Express, logger).forEach((route) => {
          allRoutes.push(route);
        });
      } catch (e) {
        logger.log('error', `unable to capture route for prom-metrics: ${e}`);
      }
    }
    metricsMiddleware(req, res, next);
  };

  return handler;
};

export default makeMetricsApiMiddleware;
