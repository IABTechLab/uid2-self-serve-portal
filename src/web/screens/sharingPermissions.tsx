import { useContext } from 'react';

import { ParticipantContext } from '../contexts/ParticipantProvider';
import { PortalRoute } from './routeUtils';

import './accountInformation.scss';

function SharingPermissions() {
  const { participant } = useContext(ParticipantContext);
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
