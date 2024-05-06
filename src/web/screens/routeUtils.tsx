import { LoaderFunction, LoaderFunctionArgs, RouteObject } from 'react-router-dom';

import { setAuthToken } from '../axios';
import keycloak from '../Keycloak';
import { PrivateRoute } from './PrivateRoute';

function IsPortalRoute(route: PortalRoute | RouteObject): route is PortalRoute {
  return !!route.element;
}

export type PortalRoute = RouteObject & {
  path: string;
  element: JSX.Element;
  description: string;
  location?: 'default' | 'footer';
  isHidden?: boolean;
};

export const makePrivateRoute = (route: PortalRoute | RouteObject): PortalRoute => {
  if (!IsPortalRoute(route)) throw Error(`Can only make PortalRoutes private!`);
  const privateRoute: PortalRoute = {
    ...route,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
    loader: route.loader
      ? async (args: LoaderFunctionArgs) => {
          if (!keycloak.authenticated) {
            const token = localStorage.getItem('authToken');
            setAuthToken(token ?? undefined);
          }
          return (route.loader as LoaderFunction)(args);
        }
      : undefined,
  };
  return route.index
    ? privateRoute
    : {
        ...privateRoute,
        index: false,
        children: privateRoute.children?.map(makePrivateRoute),
      };
};
