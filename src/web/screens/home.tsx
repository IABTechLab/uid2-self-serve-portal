import log from 'loglevel';
import { useContext, useEffect, useState } from 'react';

import { Loading } from '../components/Core/Loading';
import DocumentationCard from '../components/Home/DocumentationCard';
import SharingPermissionCard from '../components/Home/SharingPermissionCard';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetSharingParticipants } from '../services/participant';
import { PortalRoute } from './routeUtils';

import './home.scss';

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [sharingPermissionsCount, setSharingPermissionsCount] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    const getSharingParticipantsCount = async () => {
      setIsLoading(true);
      try {
        const sharingPermissions = await GetSharingParticipants();
        setSharingPermissionsCount(sharingPermissions.length);
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
};
