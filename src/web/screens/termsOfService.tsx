import { TermsAndConditions } from '../components/Core/TermsAndConditions/TermsAndConditions';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './accountPending.scss';

function TermsOfService() {
  return <TermsAndConditions />;
}

export const TermsOfServiceRoute: PortalRoute = {
  path: '/termsOfService',
  element: <TermsOfService />,
  errorElement: <RouteErrorBoundary />,
  description: 'Terms of Service',
  location: 'footer',
};
