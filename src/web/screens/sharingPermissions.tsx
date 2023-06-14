import { useState } from 'react';

import { StatusPopup } from '../components/Core/StatusPopup';
import { SearchAndAddParticipants } from '../components/SharingPermission/searchAndAddParticipantsDialog';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { PortalRoute } from './routeUtils';

type StatusPopupType = {
  message: string;
  type: 'Success' | 'Error' | 'Info';
};

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusPopup, setStatusPopup] = useState<StatusPopupType>();
  const handleSharingPermissionsAdded = async () => {
    setShowStatusPopup(true);
    setStatusPopup({
      type: 'Success',
      message: '1 Participant added to Your Sharing Permissions',
    });
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
      <SharingPermissionsTable sharedParticipants={[]}>
        <SearchAndAddParticipants
          defaultSelected={[]}
          onSharingPermissionsAdded={handleSharingPermissionsAdded}
        />
      </SharingPermissionsTable>
      {statusPopup && (
        <StatusPopup
          status={statusPopup!.type}
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={statusPopup!.message}
        />
      )}
    </div>
  );
}

export const SharingPermissionsRoute: PortalRoute = {
  description: 'Sharing Permissions',
  element: <SharingPermissions />,
  path: '/dashboard/sharing',
};
