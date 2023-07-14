import { TermsAndConditions } from '../components/Core/TermsAndConditions';
import { PortalRoute } from './routeUtils';

import './accountPending.scss';

function TermsOfService() {
  return <TermsAndConditions />;
}

export const TermsOfServiceRoute: PortalRoute = {
  path: '/termsOfService',
  element: <TermsOfService />,
  description: 'Terms of service',
  location: 'footer',
};
