import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ClientType } from '../../api/services/adminServiceHelpers';
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
  const [sharedSiteIds, setSharedSiteIds] = useState<number[]>([]);
  const [sharedTypes, setSharedTypes] = useState<ClientType[]>([]);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();
  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantTypeDTO[] };

  const handleSaveSharingType = async (selectedTypes: string[]) => {
    try {
      console.log('selectedTypes', selectedTypes);
      console.log('sharedSiteIds', sharedSiteIds);

      const response = await AddSharingParticipants(participant!.id, sharedSiteIds, selectedTypes);
      setStatusPopup({
        type: 'Success',
        message: `${
          selectedTypes.length === 1
            ? '1 Participant type'
            : `${selectedTypes.length} Participant types`
        } saved to Your Sharing Permissions`,
      });
      setSharedTypes(response.allowed_types);
      console.log('handleBulkAddSharingPermission response', response);
    } catch (e) {
      setStatusPopup({
        type: 'Error',
        message: `Save Sharing Permissions Failed`,
      });
    } finally {
      setShowStatusPopup(true);
    }
  };

  const handleAddSharingSite = async (selectedSiteIds: number[]) => {
    try {
      console.log('sharedTypes', sharedTypes);
      console.log('sharedSiteIds', sharedSiteIds);

      const response = await AddSharingParticipants(participant!.id, selectedSiteIds, sharedTypes);
      setStatusPopup({
        type: 'Success',
        message: `${
          selectedSiteIds.length === 1 ? '1 Participant' : `${selectedSiteIds.length} Participants`
        } added to Your Sharing Permissions`,
      });
      setSharedSiteIds(response.allowed_sites);
      console.log('handleSharingPermissionsAdded response', response);
    } catch (e) {
      setStatusPopup({
        type: 'Error',
        message: `Add Sharing Permissions Failed`,
      });
    } finally {
      setShowStatusPopup(true);
    }
  };

  const handleDeleteSharingSite = async (siteIdsToDelete: number[]) => {
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
      console.log('handleDeleteSharingPermission response', response);
      setSharedSiteIds(response.allowed_sites);
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
      <div className='bulk-add-and-search-collapsibles'>
        <BulkAddPermissions
          participant={participant}
          sharedTypes={sharedTypes ?? []}
          hasSharedSiteIds={sharedSiteIds.length > 0}
          onBulkAddSharingPermission={handleSaveSharingType}
        />
        <Suspense fallback={<Loading />}>
          <Await resolve={participantTypes}>
            {(resolvedParticipantTypes: ParticipantTypeDTO[]) => (
              <>
                <Collapsible title='Search and Add Permissions' defaultOpen>
                  <SearchAndAddParticipants
                    onSharingPermissionsAdded={handleAddSharingSite}
                    sharedSiteIds={sharedSiteIds}
                    participantTypes={resolvedParticipantTypes}
                  />
                </Collapsible>
                {(sharedSiteIds.length > 0 || sharedTypes.length > 0) && (
                  <SharingPermissionsTable
                    sharingParticipants={[]} // TODO: Jingyi to fix on her branch
                    onDeleteSharingPermission={handleDeleteSharingSite}
                    participantTypes={resolvedParticipantTypes}
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
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
    return defer({ participantTypes });
  },
};
