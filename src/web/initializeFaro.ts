import { Faro, initializeFaro as coreInit } from '@grafana/faro-react';

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
  });

  faro.api.pushLog(['Faro was initialized']);

  return faro;
}
