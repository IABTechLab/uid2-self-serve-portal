import { Suspense } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import UserManagementTable from '../components/UserManagement/UserManagementTable';
import { GetAuditTrail } from '../services/auditTrailService';
import { GetAllParticipants } from '../services/participant';
import { ChangeUserLock, GetAllUsers } from '../services/userAccount';
import { AwaitTypesafe, resolveAll } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = () => {
  const userList = GetAllUsers();
  const participantsList = GetAllParticipants();
  const auditTrail = GetAuditTrail();
  return defer({ userList, participantsList, auditTrail });
};

function ManageUsers() {
  const data = useLoaderData<typeof loader>();
  const reloader = useRevalidator();

  const onChangeUserLock = async (userId: number, isLocked: boolean) => {
    await ChangeUserLock(userId, isLocked);
    reloader.revalidate();
  };

  return (
    <>
      <h1>Manage Users</h1>
      <p className='heading-details'>
        Manage portal users. Search users by email, first name or last name.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading users...' />}>
          <AwaitTypesafe
            resolve={resolveAll({
              users: data.userList,
              participants: data.participantsList,
              auditTrail: data.auditTrail,
            })}
          >
            {(loadedData) => (
              <UserManagementTable
                users={loadedData.users}
                allParticipants={loadedData.participants}
                auditTrail={loadedData.auditTrail}
                onChangeUserLock={onChangeUserLock}
              />
            )}
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
