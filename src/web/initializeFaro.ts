import type { Faro } from '@grafana/faro-react';
import {
  getWebInstrumentations,
  initializeFaro as coreInit,
  ReactIntegration,
  ReactRouterVersion,
} from '@grafana/faro-react';
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

import { getFaroConfig } from '../api/faroConfig';

export function initializeFaro(): Faro {
  const config = getFaroConfig();
  const faro = coreInit({
    url: `http://localhost:${config.faro.portAppReceiver}/collect`,
    apiKey: config.faro.apiKey,
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),

      new ReactIntegration({
        router: {
          version: ReactRouterVersion.V6,
          dependencies: {
            createRoutesFromChildren,
            matchRoutes,
            Routes,
            useLocation,
            useNavigationType,
          },
        },
      }),
    ],
    app: {
      name: config.client.packageName,
      version: config.package.version,
      // environment: config.mode.name,
    },
  });

  faro.api.pushLog(['Faro was initialized']);

  return faro;
}
