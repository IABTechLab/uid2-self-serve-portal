import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../api/routers/participantsRouter';
import { Collapsible } from '../components/Core/Collapsible';
import { Loading } from '../components/Core/Loading';
import { StatusPopup } from '../components/Core/StatusPopup';
import { SearchAndAddParticipants } from '../components/SharingPermission/SearchAndAddParticipants';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddSharingParticipants,
  DeleteSharingParticipants,
  GetSharingParticipants,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { preloadAvailableSiteList } from '../services/site';
import { PortalRoute } from './routeUtils';

import './sharingPermissions.scss';

type StatusPopupType = {
  message: string;
  type: 'Success' | 'Error' | 'Info';
};

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const { participant } = useContext(ParticipantContext);
  const [sharingParticipants, setSharingParticipants] = useState<AvailableParticipantDTO[]>([]);
  const [statusPopup, setStatusPopup] = useState<StatusPopupType>();
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantTypeDTO[] };

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
    } finally {
      setShowStatusPopup(true);
    }
  };

  const handleDeleteSharingPermission = async (siteIdsToDelete: number[]) => {
    try {
      const response = await DeleteSharingParticipants(participant!.id, siteIdsToDelete);
      setStatusPopup({
        type: 'Success',
        message: `${siteIdsToDelete.length} sharing ${
          siteIdsToDelete.length > 1 ? 'permissions' : 'permission'
        } deleted`,
      });
      setSharingParticipants(response);
    } catch (e) {
      setStatusPopup({
        type: 'Error',
        message: `Delete Sharing Permissions Failed`,
      });
    } finally {
      setShowStatusPopup(true);
    }
  };

  const loadSharingParticipants = useCallback(async () => {
    const response = await GetSharingParticipants(participant!.id);
    setSharingParticipants(response);
  }, [participant]);

  useEffect(() => {
    loadSharingParticipants();
  }, [loadSharingParticipants]);

  return (
    <div className='sharingPermissions'>
      <h1>Sharing Permissions</h1>
      <p className='heading-details'>
        Adding a sharing permission allows the participant you’re sharing with to decrypt your UID2
        tokens.
        <br />
        <br />
        Note: This only enables the sharing permission. No data is sent.
      </p>
      <Suspense fallback={<Loading />}>
        <Await resolve={participantTypes}>
          {(resolvedParticipantTypes: ParticipantTypeDTO[]) => (
            <>
              <div className='search-and-add-permissions-collapsible'>
                <Collapsible title='Search and Add Permissions' defaultOpen>
                  <SearchAndAddParticipants
                    onSharingPermissionsAdded={handleSharingPermissionsAdded}
                    sharingParticipants={sharingParticipants}
                    participantTypes={resolvedParticipantTypes}
                  />
                </Collapsible>
              </div>
              <SharingPermissionsTable
                sharingParticipants={sharingParticipants}
                onDeleteSharingPermission={handleDeleteSharingPermission}
                participantTypes={resolvedParticipantTypes}
              />
            </>
          )}
        </Await>
      </Suspense>
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
  loader: () => {
    const participantTypes = GetAllParticipantTypes();
    preloadAvailableSiteList();
    return defer({ participantTypes });
  },
};
