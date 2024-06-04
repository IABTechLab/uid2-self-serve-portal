import { RouteObject } from 'react-router-dom';

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
  };
  return route.index
    ? privateRoute
    : {
        ...privateRoute,
        index: false,
        children: privateRoute.children?.map(makePrivateRoute),
      };
};
