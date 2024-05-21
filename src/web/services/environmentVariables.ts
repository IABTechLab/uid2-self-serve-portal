import axios from 'axios';

import { backendError } from '../utils/apiError';

export type EnvironmentVariable = {
  baseUrl: string;
  isDevelopment: boolean;
};

export type ClientConfig = {
  faroUrl: string;
};

const hostedFaroUrl =
  'https://faro-collector-prod-us-east-0.grafana.net/collect/0e0a878597e4df4ead54287f1152af30';

const configMaps: { [index: string]: ClientConfig } = {
  'portal.integ.unifiedid.com': {
    faroUrl: hostedFaroUrl,
  },
  'portal.unifiedid.com': {
    faroUrl: hostedFaroUrl,
  },
  localhost: {
    faroUrl: '',
  },
};

export function GetClientConfig() {
  const url = new URL(document.URL).hostname;
  if (Object.hasOwn(configMaps, url)) return configMaps[url];
  throw Error(`Could not find client settings for hostname ${url}.`);
}

export async function GetEnvironmentVariables() {
  try {
    const result = await axios.get<EnvironmentVariable>(`/envars`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get environment variables');
  }
}
