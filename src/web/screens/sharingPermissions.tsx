import { useContext, useEffect, useState } from 'react';
import { defer } from 'react-router-dom';

import { StatusPopup } from '../components/Core/StatusPopup';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  GetAllParticipants,
  GetSharingParticipants,
  ParticipantResponse,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const handleSharingPermissionsAdded = () => {
    setShowStatusPopup(true);
  };
  const { participant } = useContext(ParticipantContext);
  const [sharingParticipants, setSharingParticipants] = useState<ParticipantResponse[]>([]);

  useEffect(() => {
    const loadSharingParticipants = async () => {
      const response = await GetSharingParticipants(participant!.id);
      setSharingParticipants(response);
    };
    loadSharingParticipants();
  }, [participant, setSharingParticipants]);

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
        sharingParticipants={sharingParticipants}
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
  loader: async () => {
    const participants = GetAllParticipants();
    const participantTypes = await GetAllParticipantTypes();
    return defer({ participants, participantTypes });
  },
};
