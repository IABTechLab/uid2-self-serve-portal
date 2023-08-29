import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { AvailableParticipantDTO } from '../../api/routers/participantsRouter';
import { Collapsible } from '../components/Core/Collapsible';
import { Loading } from '../components/Core/Loading';
import { StatusPopup } from '../components/Core/StatusPopup';
import { BulkAddPermissions } from '../components/SharingPermission/BulkAddPermissions';
import { SearchAndAddParticipants } from '../components/SharingPermission/SearchAndAddParticipants';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddSharingParticipants,
  DeleteSharingParticipants,
  GetAllAvailableParticipants,
  GetSharedTypes,
  GetSharingParticipants,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
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
  const [sharedTypes, setSharedTypes] = useState<string[]>([]);
  const [statusPopup, setStatusPopup] = useState<StatusPopupType>();
  const { participants, participantTypes } = useLoaderData() as {
    participants: AvailableParticipantDTO[];
    participantTypes: ParticipantTypeDTO[];
  };

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

  const loadSharingParticipants = useCallback(async () => {
    const response = await GetSharingParticipants(participant!.id);
    setSharingParticipants(response);
  }, [participant]);

  const loadSharedTypes = useCallback(async () => {
    const response = await GetSharedTypes(participant!.id);
    console.log('------------GetSharedTypes response', response);
    setSharedTypes(response);
  }, [participant]);

  useEffect(() => {
    loadSharingParticipants();
    loadSharedTypes();
  }, [loadSharingParticipants, loadSharedTypes]);

  const handleBulkAddSharingPermission = async (selectedTypes: string[]) => {
    try {
      console.log('selectedTypes', selectedTypes);

      // move this into useEffect instead?
      const sharedSiteIds = sharingParticipants.map((sp) => sp.siteId!); // can I do ! here?
      // call new api
      const response = await AddSharingParticipants(participant!.id, sharedSiteIds, selectedTypes);
      setStatusPopup({
        type: 'Success',
        message: `${
          // eslint-disable-next-line no-nested-ternary
          selectedTypes.length === 1
            ? '1 Participant type'
            : `${selectedTypes.length} Participant types`
        } saved to your sharing permissions`,
      });
      // TODO AddSharingParticipants doesn't yet return the correct types yet, so commenting out for now
      // setSharingParticipants(response);
    } catch (e) {
      setStatusPopup({
        type: 'Error',
        message: `Save Sharing Permissions Failed`,
      });
    } finally {
      setShowStatusPopup(true);
    }
  };

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
      {(sharingParticipants.length > 0 || sharedTypes.length > 0) && (
        <SharingPermissionsTable
          sharingParticipants={sharingParticipants}
          onDeleteSharingPermission={handleDeleteSharingPermission}
          participantTypes={participantTypes}
        />
      )}
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
    const participants = GetAllAvailableParticipants();
    const participantTypes = await GetAllParticipantTypes();
    return defer({ participants, participantTypes });
  },
};
