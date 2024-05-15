import { Faro, initializeFaro as coreInit } from '@grafana/faro-react';

import config from '../../package.json';

export async function initializeFaro(): Promise<Faro> {
  const faro = coreInit({
    url: process.env.REACT_APP_FARO_URL,
    app: {
      name: config.name,
      version: config.version,
      environment: process.env.NODE_ENV,
    },
  });

  faro.api.pushLog(['Faro was initialized']);

  return faro;
}
