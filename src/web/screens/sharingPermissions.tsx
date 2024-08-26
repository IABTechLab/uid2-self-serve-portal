import { AxiosError } from 'axios';
import { ReactNode, Suspense, useContext } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import { ClientType, SharingListResponse } from '../../api/services/adminServiceHelpers';
import { Banner } from '../components/Core/Banner/Banner';
import { Collapsible } from '../components/Core/Collapsible/Collapsible';
import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
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
import { makeParticipantLoader } from '../utils/loaderHelpers';
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
async function loadSharingList(participantId: number): Promise<SharingListLoaderData> {
  try {
    const response = await GetSharingList(participantId);
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

const loader = makeParticipantLoader((participantId) =>
  defer({ sharingList: loadSharingList(participantId) })
);

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
            ? '1 participant type'
            : `${selectedTypes.length} participant types`
        } saved to your sharing permissions.`
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
          selectedSiteIds.length === 1 ? '1 participant' : `${selectedSiteIds.length} participants`
        } added to your sharing permissions.`
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
        } deleted.`
      );
      reloader.revalidate();
    } catch (e) {
      handleErrorToast(e);
    }
  };

  // publisher without SHARER
  const showPubSharingMessage =
    (participant?.types || []).some((type) => type.typeName === 'Publisher') &&
    !(participant?.apiRoles || []).some((role) => role.roleName === 'SHARER');

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
                    decrypt your UID2 tokens. For more information, see{' '}
                    <a
                      className='outside-link'
                      target='_blank'
                      href='https://unifiedid.com/docs/portal/sharing-permissions'
                      rel='noreferrer'
                    >
                      Sharing Permissions
                    </a>
                    .
                    <br />
                    <br />
                    Note: This only enables the sharing permission. No data is sent.
                    {showPubSharingMessage && (
                      <>
                        <br />
                        <br />
                        <span>
                          As a publisher, you can share with others by granting permission on this
                          page. However, to allow others to share with you, you must ask your UID2
                          contact to get the correct permissions added to your account.
                        </span>
                      </>
                    )}
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
  path: '/participant/:participantId/sharing',
  loader,
};
