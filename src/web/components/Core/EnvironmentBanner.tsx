import { useEffect, useState } from 'react';

import { EnvironmentVariable, GetEnvironmentVariables } from '../../services/environmentVariables';
import { ApiError } from '../../utils/apiError';
import { useAsyncThrowError } from '../../utils/errorHandler';
import { Banner } from './Banner';

function EnvironmentBanner() {
  const [environment, setEnvironment] = useState<EnvironmentVariable>({
    baseUrl: '',
    isDevelopment: false,
  });
  const throwError = useAsyncThrowError();

  useEffect(() => {
    const loadEnvironmentVariables = async () => {
      try {
        const environmentData = await GetEnvironmentVariables();
        setEnvironment(environmentData);
      } catch (e: unknown) {
        if (e instanceof ApiError) throwError(e);
      }
    };
    loadEnvironmentVariables();
  }, [throwError]);

  const { baseUrl, isDevelopment } = environment;
  const showBanner = isDevelopment && !baseUrl.includes('localhost');

  return showBanner ? <Banner type='Error' message={`Your base URL is ${baseUrl}`} /> : null;
}

export { EnvironmentBanner };
