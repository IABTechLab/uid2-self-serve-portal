import { AxiosError } from 'axios';
import log from 'loglevel';
import { Suspense, useContext } from 'react';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ClientType } from '../../api/services/adminServiceHelpers';
import ErrorView from '../components/Core/ErrorView';
import { Loading } from '../components/Core/Loading';
import DocumentationCard from '../components/Home/DocumentationCard';
import SharingPermissionCard from '../components/Home/SharingPermissionCard';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetSharingList } from '../services/participant';
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
const loader = makeLoader(() => defer({ counts: getSharingCounts() }));

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Welcome back, {LoggedInUser?.profile.firstName}</h1>
      <div className='dashboard-cards-container'>
        <Suspense fallback={<Loading />}>
          <AwaitTypesafe resolve={data.counts} errorElement={<ErrorView />}>
            {(counts) => (
              <SharingPermissionCard
                sharingPermissionsCount={counts.sharingPermissionsCount}
                bulkPermissionsCount={counts.bulkPermissionsCount}
              />
            )}
          </AwaitTypesafe>
        </Suspense>
        <DocumentationCard />
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
