import { Await as RRAwait } from 'react-router-dom';

// Hopefully temporary until react-router-typesafe package fixes its Await type.

export type AwaitResolveRenderFunction<T> = (data: Awaited<T>) => React.ReactNode;

export type AwaitProps<T> = {
  children: React.ReactNode | AwaitResolveRenderFunction<T>;
  errorElement?: React.ReactNode;
  resolve: T;
};

export const AwaitTypesafe = RRAwait as <T>(props: AwaitProps<T>) => React.JSX.Element;
