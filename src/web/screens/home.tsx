import { AxiosError } from 'axios';
import log from 'loglevel';
import { Suspense, useContext } from 'react';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ClientType } from '../../api/services/adminServiceHelpers';
import { shouldRotateApiKey } from '../components/ApiKeyManagement/KeyHelper';
import { Banner } from '../components/Core/Banner/Banner';
import { AsyncErrorView } from '../components/Core/Views/ErrorView';
import { Loading } from '../components/Core/Loading/Loading';
import DocumentationCard from '../components/Home/DocumentationCard';
import RotateApiKeysCard from '../components/Home/RotateApiKeyCard';
import SharingPermissionCard from '../components/Home/SharingPermissionCard';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetEmailContacts, GetParticipantApiKeys, GetSharingList } from '../services/participant';
import { getAllSites } from '../services/site';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './home.scss';

async function getSharingCounts() {
  let manualSites: number[] = [];
  let allowedTypes: ClientType[] = [];
  let hasKeyset: boolean = true;
  const allSitesPromise = getAllSites();
  try {
    const sharingList = await GetSharingList();
    manualSites = sharingList.allowed_sites;
    allowedTypes = sharingList.allowed_types;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.data?.missingKeyset) {
      hasKeyset = false;
    } else {
      log.error(e);
      throw e;
    }
  }

  try {
    const allowedTypeSet = new Set<ClientType>(allowedTypes);
    const siteList = await allSitesPromise;
    const bulkSites = siteList.filter((item) => {
      const clientTypes = item.clientTypes || [];
      return clientTypes.some((clientType) => allowedTypeSet.has(clientType));
    });
    return {
      sharingPermissionsCount: manualSites.length,
      bulkPermissionsCount: bulkSites.length,
      hasKeyset,
    };
  } catch (e: unknown) {
    log.error(e);
    throw e;
  }
}

async function getEmailContacts() {
  const emailContacts = await GetEmailContacts();
  if (emailContacts.length === 0) {
    return false;
  }
  return true;
}

async function getApiKeysToRotate() {
  const apiKeys = await GetParticipantApiKeys();
  return apiKeys.filter((apiKey) => shouldRotateApiKey(apiKey) === true);
}

const loader = makeLoader(() =>
  defer({
    counts: getSharingCounts(),
    hasEmailContacts: getEmailContacts(),
    apiKeysToRotate: getApiKeysToRotate(),
  })
);

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Hello, {LoggedInUser?.profile.firstName}</h1>
      <Suspense fallback={<Loading />}>
        <AwaitTypesafe resolve={data.hasEmailContacts} errorElement={<AsyncErrorView />}>
          {(hasEmailContacts) => (
            <div>
              {!hasEmailContacts && (
                <Banner
                  message='Please add your email contacts to stay up to date on all UID2 updates.'
                  type='Info'
                  fitContent
                />
              )}
            </div>
          )}
        </AwaitTypesafe>
      </Suspense>
      <div className='dashboard-cards-container'>
        <div>
          <Suspense fallback={<Loading />}>
            <AwaitTypesafe resolve={data.apiKeysToRotate} errorElement={<AsyncErrorView />}>
              {(apiKeysToRotate) =>
                apiKeysToRotate.length > 0 && (
                  <div className='dashboard-card'>
                    <RotateApiKeysCard apiKeysToRotate={apiKeysToRotate} />
                  </div>
                )
              }
            </AwaitTypesafe>
          </Suspense>

          <div className='dashboard-card'>
            <Suspense fallback={<Loading />}>
              <AwaitTypesafe resolve={data.counts} errorElement={<AsyncErrorView />}>
                {(counts) => (
                  <SharingPermissionCard
                    sharingPermissionsCount={counts.sharingPermissionsCount}
                    bulkPermissionsCount={counts.bulkPermissionsCount}
                    hasKeyset={counts.hasKeyset}
                  />
                )}
              </AwaitTypesafe>
            </Suspense>
          </div>
        </div>
        <div className='dashboard-card'>
          <DocumentationCard />
        </div>
      </div>
    </>
  );
}

export const HomeRoute: PortalRoute = {
  path: '/',
  description: 'Home',
  element: <Home />,
  errorElement: <RouteErrorBoundary />,
  loader,
};
