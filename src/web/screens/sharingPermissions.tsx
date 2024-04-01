import { AxiosError } from 'axios';
import { ReactNode, useContext, useEffect, useState } from 'react';

import { ClientType } from '../../api/services/adminServiceHelpers';
import { Banner } from '../components/Core/Banner';
import { Collapsible } from '../components/Core/Collapsible';
import { SuccessToast } from '../components/Core/Toast';
import { BulkAddPermissions } from '../components/SharingPermission/BulkAddPermissions';
import { SearchAndAddParticipants } from '../components/SharingPermission/SearchAndAddParticipants';
import { SharingPermissionsTable } from '../components/SharingPermission/SharingPermissionsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import {
  AddSharingParticipants,
  CompleteRecommendations,
  DeleteSharingParticipants,
  GetSharingList,
  UpdateSharingTypes,
} from '../services/participant';
import { handleErrorToast } from '../utils/apiError';
import { useAsyncError } from '../utils/errorHandler';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './sharingPermissions.scss';

function SharingPermissionPageContainer({ children }: { children: ReactNode }) {
  return (
    <div className='sharingPermissions'>
      <h1>Sharing Permissions</h1>
      {children}
    </div>
  );
}

function SharingPermissions() {
  const [showNoKeySetError, setNoKeySetError] = useState(false);
  const [sitesLoaded, setSitesLoaded] = useState(false);
  const { participant, setParticipant } = useContext(ParticipantContext);
  const [sharedSiteIds, setSharedSiteIds] = useState<number[]>([]);
  const [sharedTypes, setSharedTypes] = useState<ClientType[]>([]);
  const throwError = useAsyncError();

  const handleSaveSharingType = async (selectedTypes: ClientType[]) => {
    try {
      const response = await UpdateSharingTypes(participant!.id, selectedTypes);
      SuccessToast(
        `${
          selectedTypes.length === 1
            ? '1 Participant type'
            : `${selectedTypes.length} Participant types`
        } saved to your Sharing Permissions`
      );
      setSharedTypes(response.allowed_types ?? []);
      if (!participant?.completedRecommendations) {
        const updatedParticipant = await CompleteRecommendations(participant!.id);
        setParticipant(updatedParticipant);
      }
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const handleAddSharingSite = async (selectedSiteIds: number[]) => {
    try {
      const response = await AddSharingParticipants(participant!.id, selectedSiteIds);
      SuccessToast(
        `${
          selectedSiteIds.length === 1 ? '1 Participant' : `${selectedSiteIds.length} Participants`
        } added to your Sharing Permissions`
      );
      setSharedSiteIds(response.allowed_sites);
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const handleDeleteSharingSite = async (siteIdsToDelete: number[]) => {
    try {
      const response = await DeleteSharingParticipants(participant!.id, siteIdsToDelete);
      SuccessToast(
        `${siteIdsToDelete.length} sharing ${
          siteIdsToDelete.length > 1 ? 'permissions' : 'permission'
        } deleted`
      );
      setSharedSiteIds(response.allowed_sites);
    } catch (e) {
      handleErrorToast(e);
    }
  };

  useEffect(() => {
    const loadSharingList = async () => {
      try {
        const response = await GetSharingList();
        // deal with no keysets properly here
        setSharedSiteIds(response.allowed_sites);
        setSharedTypes(response.allowed_types ?? []);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          if (e.response?.data?.missingKeyset) {
            setNoKeySetError(true);
            return;
          }
          throwError(e);
        }
      } finally {
        setSitesLoaded(true);
      }
    };
    loadSharingList();
  }, [throwError]);

  if (!sitesLoaded) {
    return <div />;
  }

  if (showNoKeySetError) {
    return (
      <div className='sharing-permissions-table'>
        <SharingPermissionPageContainer>
          <Banner
            message='Use of sharing requires an API Key or Client Side Keypair.  Please reach out to our support team for assistance.'
            type='Info'
            fitContent
          />
        </SharingPermissionPageContainer>
      </div>
    );
  }

  return (
    <SharingPermissionPageContainer>
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
          onBulkAddSharingPermission={handleSaveSharingType}
        />
        <Collapsible title='Add Permissions — Individual' defaultOpen>
          <>
            <p className='search-description'>
              Add individual participants, using search, and click to grant them permission to
              decrypt your UID2 tokens.
            </p>
            <SearchAndAddParticipants
              onSharingPermissionsAdded={handleAddSharingSite}
              sharedSiteIds={sharedSiteIds}
            />
          </>
        </Collapsible>

        <SharingPermissionsTable
          sharedSiteIds={sharedSiteIds}
          sharedTypes={sharedTypes}
          onDeleteSharingPermission={handleDeleteSharingSite}
        />
      </div>
    </SharingPermissionPageContainer>
  );
}

export const SharingPermissionsRoute: PortalRoute = {
  description: 'Sharing Permissions',
  element: <SharingPermissions />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/sharing',
};
