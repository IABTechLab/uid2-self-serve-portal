import express from 'express';
import { Opts } from 'express-prom-bundle';
import winston from 'winston';

import { makeNormalizePath, toRoute, withoutTrailingSlash } from '../metrics';

describe('metrics', () => {
  describe('makeNormalizePath', () => {
    const opts = {} as Opts;
    const requestFor = (originalPath: string, method: string) =>
      ({
        url: originalPath,
        method,
      }) as express.Request;

    const logger = {
      error: (_message) => {},
    } as winston.Logger;

    it('does nothing when disabled', () => {
      const req = requestFor('/my/url/', 'get');

      const normalizedPath = makeNormalizePath(false, [], logger)(req, opts);
      expect(normalizedPath).toEqual('/my/url/');
    });

    it('maps unknown paths to unmatched-url', () => {
      const req = requestFor('/my/url/', 'get');

      const normalizedPath = makeNormalizePath(true, [], logger)(req, opts);

      expect(normalizedPath).toEqual('unmatched-url');
    });

    it('maps paths to unmatched-url when path is only known with different methods', () => {
      const req = requestFor('/my/url/', 'GET');
      const allRoutes = [toRoute('/my/url/', ['POST'])];

      const normalizedPath = makeNormalizePath(true, allRoutes, logger)(req, opts);

      expect(normalizedPath).toEqual('unmatched-url');
    });

    it('maps path to itself without trailing slash when matching without path variables', () => {
      const req = requestFor('/my/url/', 'post');
      const allRoutes = [toRoute('/my/url/', ['POST'])];

      const normalizedPath = makeNormalizePath(true, allRoutes, logger)(req, opts);

      expect(normalizedPath).toEqual('/my/url');
    });

    it('maps path to path template without trailing slash when matching with path variables', () => {
      const req = requestFor('/my/url/5', 'post');
      const allRoutes = [toRoute('/my/url/:userId/', ['POST'])];

      const normalizedPath = makeNormalizePath(true, allRoutes, logger)(req, opts);

      expect(normalizedPath).toEqual('/my/url/:userId');
    });
  });

  describe('withoutTrailingSlash', () => {
    it('does nothing to root path', () => {
      expect(withoutTrailingSlash('/')).toBe('/');
    });

    it('does nothing if there is no trailing slash', () => {
      expect(withoutTrailingSlash('/my/path')).toBe('/my/path');
    });

    it('removes trailing slash', () => {
      expect(withoutTrailingSlash('/my/path/')).toBe('/my/path');
    });
  });
});
