import log from 'loglevel';
import { Suspense, useContext } from 'react';
import { Await, defer, useAsyncError, useLoaderData } from 'react-router-dom';

import DocumentationCard from '../components/Home/DocumentationCard';
import SharingPermissionCard from '../components/Home/SharingPermissionCard';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetSharingParticipants, ParticipantResponse } from '../services/participant';
import { PortalRoute } from './routeUtils';

import './home.scss';

function ErrorElement() {
  const error = useAsyncError();
  log.error(error);
  return <SharingPermissionCard error={error} />;
}

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const { sharingPermissions } = useLoaderData() as {
    sharingPermissions: ParticipantResponse[];
  };
  return (
    <>
      <h1>Welcome back, {LoggedInUser?.profile.firstName}</h1>
      <div className='dashboard-cards-container'>
        <Suspense fallback='Loading...'>
          <Await resolve={sharingPermissions} errorElement={<ErrorElement />}>
            {(resolvedSharingPermissions: ParticipantResponse[]) => (
              <SharingPermissionCard sharingPermissionsCount={resolvedSharingPermissions.length} />
            )}
          </Await>
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
  loader: () => {
    const sharingPermissions = GetSharingParticipants();
    return defer({ sharingPermissions });
  },
};
