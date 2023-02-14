import { AxiosInstance } from 'axios';
import { LoaderFunction, RouteObject } from 'react-router-dom';

export type PortalRoute = RouteObject & {
  path: string;
  element: JSX.Element;
  description: string;
  curriedLoader?: (apiClient: AxiosInstance) => LoaderFunction;
};
