import log from "loglevel";
import { createBrowserRouter } from "react-router-dom";

export function revalidateIfLoaderError(router: ReturnType<typeof createBrowserRouter>) {
  /*
    Caution: routeObj.state is marked as internal. This may be unstable!
    But I checked git and it hasn't changed in years:
    https://github.com/remix-run/react-router/blame/5d66dbdbc8edf1d9c3a4d9c9d84073d046b5785b/packages/router/router.ts#L84
    If it does change, we'll need to find another way to find out globally if there's a route loader error.
  */
  const { loaderData } = router.state;
  let hasRevalidated = false;
  Object.entries(loaderData).forEach((kvp) => {
    const loaderReturnValue = kvp[1] as unknown;
    if (!loaderReturnValue) return;
    if (typeof loaderReturnValue !== 'object') return;

    const entries = Object.values(loaderReturnValue);
    entries.forEach((entry: unknown) => {
      if (!(entry instanceof Promise)) return;
      entry.catch((_err) => {
        if (hasRevalidated) return;
        log.info('Revalidating due to new token and errored route');
        hasRevalidated = true;
        router.revalidate();
      });
    });
  });
}
