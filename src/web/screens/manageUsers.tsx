import { Suspense } from 'react';
import { defer, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import UserManagementTable from '../components/UserManagement/UserManagementTable';
import { GetAllUsersAdmin } from '../services/userAccount';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

// const oldloader = makeParticipantLoader((participantId) => {
//   const auditTrail = GetAllUsersAdmin(participantId);
//   return defer({ auditTrail });
// });

const loader = () => {
  const userList = GetAllUsersAdmin();
  return defer({ userList });
};

function ManageUsers() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Audit Trail</h1>
      <p className='heading-details'>
        View a detailed log of all past actions performed by, or on behalf of, the current
        participant.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading users...' />}>
          <AwaitTypesafe resolve={data.userList}>
            {(users) => <UserManagementTable users={users} />}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const ManageUsersRoute: PortalRoute = {
  description: 'Manage Users',
  element: <ManageUsers />,
  errorElement: <RouteErrorBoundary />,
  // ****** should we change the route here?
  path: '/participant/:participantId/ManageUsers',
  loader,
  isHidden: true,
};
