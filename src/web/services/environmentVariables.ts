import axios from 'axios';

import { backendError } from '../utils/apiError';

export type EnvironmentVariable = {
  baseUrl: string;
  isDevelopment: boolean;
};

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
