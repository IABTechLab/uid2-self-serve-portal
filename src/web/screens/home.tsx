import log from 'loglevel';
import { useContext, useEffect, useState } from 'react';

import { ClientType } from '../../api/services/adminServiceHelpers';
import { Loading } from '../components/Core/Loading';
import DocumentationCard from '../components/Home/DocumentationCard';
import SharingPermissionCard from '../components/Home/SharingPermissionCard';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetSharingList } from '../services/participant';
import { preloadAllSitesList } from '../services/site';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './home.scss';

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [sharingPermissionsCount, setSharingPermissionsCount] = useState<number>(0);
  const [bulkPermissionsCount, setBulkPermissionsCount] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const getSharingParticipantsCount = async () => {
      setIsLoading(true);
      try {
        const sharingList = await GetSharingList();
        const manualSites = sharingList.allowed_sites;
        const allowedTypes = sharingList.allowed_types;
        const allowedTypeSet = new Set<ClientType>(allowedTypes);
        const siteList = await preloadAllSitesList();
        const bulkSites = siteList.filter((item) => {
          const clientTypes = item.clientTypes || [];
          return clientTypes.some((clientType) => allowedTypeSet.has(clientType));
        });
        setSharingPermissionsCount(manualSites.length);
        setBulkPermissionsCount(bulkSites.length);
      } catch (e: unknown) {
        log.error(e);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (LoggedInUser) getSharingParticipantsCount();
  }, [LoggedInUser]);

  return (
    <>
      <h1>Welcome back, {LoggedInUser?.profile.firstName}</h1>
      <div className='dashboard-cards-container'>
        {loading ? (
          <Loading />
        ) : (
          <SharingPermissionCard
            sharingPermissionsCount={sharingPermissionsCount}
            bulkPermissionsCount={bulkPermissionsCount}
            hasError={hasError}
          />
        )}
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
};
