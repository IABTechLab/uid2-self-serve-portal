import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { InviteTeamMember } from '../services/participant';
import { GetAllUsersOfParticipant, ResendInvite, UserResponse } from '../services/userAccount';
import { PortalRoute } from './routeUtils';

function Loading() {
  return <div>Loading team data...</div>;
}

function TeamMembers() {
  const data = useLoaderData() as { users: UserResponse[] };
  const reloader = useRevalidator();
  const onTeamMembersUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
    <>
      <h1>Team Members & Contacts</h1>
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
      <h2>Team Members</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: UserResponse[]) => (
            <TeamMembersTable
              teamMembers={users}
              addTeamMember={InviteTeamMember}
              onTeamMembersUpdated={onTeamMembersUpdated}
              resendInvite={ResendInvite}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members & Contacts',
  element: <TeamMembers />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsersOfParticipant();
    return defer({ users });
  },
};
