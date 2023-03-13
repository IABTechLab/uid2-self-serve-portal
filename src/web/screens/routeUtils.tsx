import { Children } from 'react';
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';

export type PortalRoute = RouteObject & {
  path: string;
  element: JSX.Element;
  description: string;
};

export const makePrivateRoute = (route: PortalRoute): PortalRoute => {
  return {
    ...route,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
    children: route.children?.map(makePrivateRoute)
    loader: route.loader
      ? async (args: LoaderFunctionArgs) => {
          // await keycloak
          console.log('beforeLoader!!!!');
          console.log('11111');
          return route.loader!(args);
        }
      : undefined,
  };
};
