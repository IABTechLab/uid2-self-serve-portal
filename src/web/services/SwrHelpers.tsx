import axios from 'axios';
import { PropsWithChildren } from 'react';
import useSWR, { Middleware, preload, SWRConfig, SWRHook } from 'swr';

type TestSWRProviderProps<TResponse> = PropsWithChildren<{
  response: TResponse;
}>;
function createTestSWRProvider(url: string) {
  function TestSWRProvider<TResponse>({ response, children }: TestSWRProviderProps<TResponse>) {
    const testDataMiddleware: Middleware = (useSWRNext: SWRHook) => {
      const useTestDataProvider: ReturnType<Middleware> = (key, fetcher, config) => {
        let useFetcher = fetcher;
        if (key === url) {
          useFetcher = (() => response) as typeof fetcher;
        }
        return useSWRNext(key, useFetcher, config);
      };
      return useTestDataProvider;
    };
    return <SWRConfig value={{ use: [testDataMiddleware] }}>{children}</SWRConfig>;
  }
  return TestSWRProvider;
}

export function createSwrHook<TResponseType>(
  endpoint: string,
  fetcher: () => Promise<TResponseType>
) {
  const useSWRHook = () => {
    const { data, ...rest } = useSWR(endpoint, fetcher);
    return {
      sites: data,
      ...rest,
    };
  };
  return {
    hookFunction: useSWRHook,
    preloadFunction: () => {
      return preload(endpoint, fetcher);
    },
    TestDataProvider: createTestSWRProvider(endpoint),
  };
}
