import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../api/routers/participantsRouter';
import { Collapsible } from '../components/Core/Collapsible';
import { Loading } from '../components/Core/Loading';
import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
import { BulkAddPermissions } from '../components/SharingPermission/BulkAddPermissions';
import { SearchAndAddParticipants } from '../components/SharingPermission/SearchAndAddParticipants';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddSharingParticipants,
  DeleteSharingParticipants,
  GetSharingList,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

import './sharingPermissions.scss';

function SharingPermissions() {
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const { participant } = useContext(ParticipantContext);
  const [sharingParticipants, setSharingParticipants] = useState<AvailableParticipantDTO[]>([]);
  const [sharedTypes, setSharedTypes] = useState<string[]>([]);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();
  const { participants, participantTypes } = useLoaderData() as {
    participants: AvailableParticipantDTO[];
    participantTypes: ParticipantTypeDTO[];
  };
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantTypeDTO[] };

  const handleSharingPermissionsAdded = async (selectedSiteIds: number[]) => {
    try {
      console.log('sharedTypes', sharedTypes);
      const response = await AddSharingParticipants(participant!.id, selectedSiteIds, sharedTypes);
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
      const response = await DeleteSharingParticipants(
        participant!.id,
        siteIdsToDelete,
        sharedTypes
      );
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

  const loadSharingList = useCallback(async () => {
    const response = await GetSharingList(participant!.id);
    setSharedSiteIds(response.allowed_sites);
    setSharedTypes(response.allowed_types);

    console.log('loadSharingParticipants response', response);
  }, [participant]);

  useEffect(() => {
    loadSharingList();
  }, [loadSharingList]);

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
        <Await resolve={participants}>
          {(resolvedParticipants: AvailableParticipantDTO[]) => (
            <div className='bulk-add-and-search-collapsibles'>
              <BulkAddPermissions
                participant={participant}
                sharedTypes={sharedTypes ?? []}
                hasSharingParticipants={sharingParticipants.length > 0}
                availableParticipants={resolvedParticipants}
                onBulkAddSharingPermission={handleBulkAddSharingPermission}
              />
              <Collapsible title='Search and Add Permissions' defaultOpen>
                <SearchAndAddParticipants
                  onSharingPermissionsAdded={handleSharingPermissionsAdded}
                  sharingParticipants={sharingParticipants}
                  availableParticipants={resolvedParticipants}
                  participantTypes={participantTypes}
                />
              </Collapsible>
            </div>
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
