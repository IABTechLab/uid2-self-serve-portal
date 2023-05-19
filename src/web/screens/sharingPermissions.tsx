import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function SharingPermissions() {
  return (
    <div>
      <h1>Sharing Permissions</h1>
      <p>
        Adding a sharing permission only allows the participant you&apos;re sharing with to decrypt
        your encrypted UID2s. <br />
        Please note - this only allows the sharing permission to be enabled, no data is sent.
      </p>
    </div>
  );
}

export const SharingPermissionsRoute: PortalRoute = {
  description: 'Sharing Permissions',
  element: <SharingPermissions />,
  path: '/dashboard/sharing',
};
