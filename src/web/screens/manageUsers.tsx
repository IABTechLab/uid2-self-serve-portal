import { Suspense } from 'react';
import { defer, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import UserManagementTable from '../components/UserManagement/UserManagementTable';
import { GetAllUsers } from '../services/userAccount';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = () => {
  const userList = GetAllUsers();
  return defer({ userList });
};

function ManageUsers() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Manage Users</h1>
      <p className='heading-details'>Manage portal users</p>
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
  path: '/participant/:participantId/manageUsers',
  loader,
};
