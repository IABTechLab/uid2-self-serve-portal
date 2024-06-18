import {
  Faro,
  getWebInstrumentations,
  initializeFaro as coreInit,
  ReactIntegration,
  ReactRouterVersion,
} from '@grafana/faro-react';
import { matchRoutes } from 'react-router-dom';

import config from '../../package.json';
import { GetClientConfig } from './services/environmentVariables';

const { faroUrl, environment } = GetClientConfig();
export async function initializeFaro(): Promise<Faro> {
  const faro = coreInit({
    url: faroUrl,
    app: {
      name: config.name,
      version: config.version,
      environment,
    },
    instrumentations: [
      // Load the default Web instrumentations
      ...getWebInstrumentations({ captureConsole: true }),

      new ReactIntegration({
        router: {
          version: ReactRouterVersion.V6_data_router,
          dependencies: {
            matchRoutes,
          },
        },
      }),
    ],
  });

  faro.api.pushLog(['Faro was initialized']);

  return faro;
}
