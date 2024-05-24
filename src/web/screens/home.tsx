import { AxiosError } from 'axios';
import log from 'loglevel';
import { Suspense, useContext } from 'react';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ClientType } from '../../api/services/adminServiceHelpers';
import { Banner } from '../components/Core/Banner';
import { AsyncErrorView } from '../components/Core/ErrorView';
import { Loading } from '../components/Core/Loading';
import DocumentationCard from '../components/Home/DocumentationCard';
import RotateApiKeysCard from '../components/Home/RotateAPIKeysCard';
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
  const allSitesPromise = getAllSites();
  try {
    const sharingList = await GetSharingList();
    manualSites = sharingList.allowed_sites;
    allowedTypes = sharingList.allowed_types;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.data?.missingKeyset) {
      // having no keyset is an expected state.  Don't error on this
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
  console.log(apiKeys);
  const currentDate = new Date().getTime();
  const currentDateFormat = Math.floor(currentDate / 1000);
  return apiKeys.filter(
    (apiKey) => apiKey.disabled === false && currentDateFormat - apiKey.created > 2629800
  );
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
      <h1>Welcome back, {LoggedInUser?.profile.firstName}</h1>
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
                  <div className='dashboard-cards'>
                    <RotateApiKeysCard apiKeysToRotate={apiKeysToRotate} />{' '}
                  </div>
                )
              }
            </AwaitTypesafe>
          </Suspense>

          <div className='dashboard-cards'>
            <Suspense fallback={<Loading />}>
              <AwaitTypesafe resolve={data.counts} errorElement={<AsyncErrorView />}>
                {(counts) => (
                  <SharingPermissionCard
                    sharingPermissionsCount={counts.sharingPermissionsCount}
                    bulkPermissionsCount={counts.bulkPermissionsCount}
                  />
                )}
              </AwaitTypesafe>
            </Suspense>
          </div>
        </div>
        <div className='dashboard-cards'>
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
