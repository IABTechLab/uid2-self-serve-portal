import { Children } from 'react';
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';

function IsPortalRoute(route: PortalRoute | RouteObject): route is PortalRoute {
  return !!route.element;
}

function FakeComponent() {
  return <div />;
}

export type PortalRoute = RouteObject & {
  path: string;
  element: JSX.Element;
  description: string;
};

export const makePrivateRoute = (route: PortalRoute | RouteObject): PortalRoute => {
  const x = route.children?.map(makePrivateRoute);
  if (!IsPortalRoute(route)) throw Error(`Can only make PortalRoutes private!`);
  if (route.index) return route;
  return {
    ...route,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
    children: route.index ? undefined : route.children?.map(makePrivateRoute),
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
