import { useState } from 'react';

import { StatusPopup } from '../components/Core/StatusPopup';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { PortalRoute } from './routeUtils';

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const handleSharingPermissionsAdded = () => {
    setShowStatusPopup(true);
  };

  return (
    <div>
      <h1>Sharing Permissions</h1>
      <p>
        Adding a sharing permission only allows the participant you&apos;re sharing with to decrypt
        your encrypted UID2s.
        <br />
        <br />
        <b>Please note - this only allows the sharing permission to be enabled, no data is sent.</b>
      </p>
      <SharingPermissionsTable
        sharedParticipants={[]}
        onSharingPermissionsAdded={handleSharingPermissionsAdded}
      />
      {showStatusPopup && (
        <StatusPopup status='Success' message='1 Participant added to Your Sharing Permissions' />
      )}
    </div>
  );
}

export const SharingPermissionsRoute: PortalRoute = {
  description: 'Sharing Permissions',
  element: <SharingPermissions />,
  path: '/dashboard/sharing',
};
