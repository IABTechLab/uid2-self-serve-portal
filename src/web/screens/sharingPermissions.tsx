/* eslint-disable camelcase */
import { AxiosError } from 'axios';
import { ReactNode, Suspense, useContext } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ClientType, SharingListResponse } from '../../api/services/adminServiceHelpers';
import { Banner } from '../components/Core/Banner';
import { Collapsible } from '../components/Core/Collapsible';
import { Loading } from '../components/Core/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
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
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './sharingPermissions.scss';

type SharingListLoaderData =
  | { hasKeyset: false }
  | {
      hasKeyset: true;
      sharedSiteIds: SharingListResponse['allowed_sites'];
      sharedTypes: SharingListResponse['allowed_types'];
    };
async function loadSharingList(): Promise<SharingListLoaderData> {
  try {
    const response = await GetSharingList();
    return {
      hasKeyset: true,
      sharedSiteIds: response.allowed_sites,
      sharedTypes: response.allowed_types ?? [],
    };
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.data?.missingKeyset) {
      return { hasKeyset: false };
    }
    throw e;
  }
}
const loader = makeLoader(() => defer({ sharingList: loadSharingList() }));

function SharingPermissionPageContainer({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className='sharingPermissions'>
      <h1>Sharing Permissions</h1>
      {children}
    </div>
  );
}

function SharingPermissions() {
  const data = useLoaderData<typeof loader>();
  const reloader = useRevalidator();
  const { participant, setParticipant } = useContext(ParticipantContext);

  const handleSaveSharingType = async (selectedTypes: ClientType[]) => {
    try {
      await UpdateSharingTypes(participant!.id, selectedTypes);
      SuccessToast(
        `${
          selectedTypes.length === 1
            ? '1 Participant type'
            : `${selectedTypes.length} Participant types`
        } saved to your Sharing Permissions`
      );
      if (!participant?.completedRecommendations) {
        const updatedParticipant = await CompleteRecommendations(participant!.id);
        setParticipant(updatedParticipant);
      }
      reloader.revalidate();
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const handleAddSharingSite = async (selectedSiteIds: number[]) => {
    try {
      await AddSharingParticipants(participant!.id, selectedSiteIds);
      SuccessToast(
        `${
          selectedSiteIds.length === 1 ? '1 Participant' : `${selectedSiteIds.length} Participants`
        } added to your Sharing Permissions`
      );
      reloader.revalidate();
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const handleDeleteSharingSite = async (siteIdsToDelete: number[]) => {
    try {
      await DeleteSharingParticipants(participant!.id, siteIdsToDelete);
      SuccessToast(
        `${siteIdsToDelete.length} sharing ${
          siteIdsToDelete.length > 1 ? 'permissions' : 'permission'
        } deleted`
      );
      reloader.revalidate();
    } catch (e) {
      handleErrorToast(e);
    }
  };

  return (
    <SharingPermissionPageContainer>
      <Suspense fallback={<Loading />}>
        <AwaitTypesafe resolve={data.sharingList}>
          {(sharingList) => (
            <>
              {!sharingList.hasKeyset && (
                <Banner
                  message='Use of sharing requires an API key or client-side key pair.  Please reach out to our support team for assistance.'
                  type='Info'
                  fitContent
                />
              )}
              {sharingList.hasKeyset && (
                <>
                  <p className='heading-details'>
                    Adding a sharing permission allows the participant you’re sharing with to
                    decrypt your UID2 tokens.
                    <br />
                    <br />
                    Note: This only enables the sharing permission. No data is sent.
                  </p>
                  <ScreenContentContainer>
                    <BulkAddPermissions
                      participant={participant}
                      sharedTypes={sharingList.sharedTypes ?? []}
                      onBulkAddSharingPermission={handleSaveSharingType}
                    />
                    <Collapsible title='Add Permissions — Individual' defaultOpen>
                      <>
                        <p className='search-description'>
                          Add individual participants, using search, and click to grant them
                          permission to decrypt your UID2 tokens.
                        </p>
                        <SearchAndAddParticipants
                          onSharingPermissionsAdded={handleAddSharingSite}
                          sharedSiteIds={sharingList.sharedSiteIds}
                        />
                      </>
                    </Collapsible>
                    <SharingPermissionsTable
                      sharedSiteIds={sharingList.sharedSiteIds}
                      sharedTypes={sharingList.sharedTypes}
                      onDeleteSharingPermission={handleDeleteSharingSite}
                    />
                  </ScreenContentContainer>
                </>
              )}
            </>
          )}
        </AwaitTypesafe>
      </Suspense>
    </SharingPermissionPageContainer>
  );
}

export const SharingPermissionsRoute: PortalRoute = {
  description: 'Sharing Permissions',
  element: <SharingPermissions />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/sharing',
  loader,
};
