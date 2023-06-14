import { useContext, useEffect, useState } from 'react';
import { defer } from 'react-router-dom';

import { StatusPopup } from '../components/Core/StatusPopup';
import { SearchAndAddParticipants } from '../components/SharingPermission/searchAndAddParticipantsDialog';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddSharingParticipants,
  GetAllParticipants,
  GetSharingParticipants,
  ParticipantResponse,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

type StatusPopupType = {
  message: string;
  type: 'Success' | 'Error' | 'Info';
};

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const { participant } = useContext(ParticipantContext);
  const [sharingParticipants, setSharingParticipants] = useState<ParticipantResponse[]>([]);
  const [statusPopup, setStatusPopup] = useState<StatusPopupType>();

  const handleSharingPermissionsAdded = async (selectedSiteIds: number[]) => {
    try {
      const response = await AddSharingParticipants(participant!.id, selectedSiteIds);
      setStatusPopup({
        type: 'Success',
        message: `${
          selectedSiteIds.length === 1 ? '1 Participant' : `${selectedSiteIds.length} Participants`
        } added to Your Sharing Permissions`,
      });
      setSharingParticipants(response);
    } catch (e) {
      setStatusPopup({
        type: 'Error',
        message: `Add Sharing Permissions Failed`,
      });
    }
    setShowStatusPopup(true);
  };

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
      <SharingPermissionsTable sharingParticipants={sharingParticipants}>
        <SearchAndAddParticipants
          onSharingPermissionsAdded={handleSharingPermissionsAdded}
          defaultSelected={sharingParticipants}
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
  loader: async () => {
    const participants = GetAllParticipants();
    const participantTypes = await GetAllParticipantTypes();
    return defer({ participants, participantTypes });
  },
};
