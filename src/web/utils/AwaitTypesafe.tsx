import { Await as RRAwait } from 'react-router-dom';

// Hopefully temporary until react-router-typesafe package fixes its Await type.

export type AwaitResolveRenderFunction<T> = (data: Awaited<T>) => React.ReactNode;

export type AwaitProps<T> = {
  children: React.ReactNode | AwaitResolveRenderFunction<T>;
  errorElement?: React.ReactNode;
  resolve: T;
};

export const AwaitTypesafe = RRAwait as <T>(props: AwaitProps<T>) => React.JSX.Element;

/*
Accepts an object consisting of keys and values that are promises, passes them through
Promise.all, and destructures the result back to the Promise results mapped to the original keys.
*/
export function resolveAll<T extends Record<string | number | symbol, Promise<unknown>>>(
  t: T
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}> {
  const entries = Object.entries(t);
  return Promise.all(entries.map(([_, v]) => v)).then((res) =>
    entries.reduce(
      (acc, [k, _], i) => ({
        ...acc,
        [k]: res[i],
      }),
      {} as { [K in keyof T]: Awaited<T[K]> }
    )
  );
}
