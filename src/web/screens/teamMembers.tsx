import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { InviteTeamMember, InviteTeamMemberForm } from '../services/participant';
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

  const handleAddTeamMember = async (formData: InviteTeamMemberForm, participantId: number) => {
    await InviteTeamMember(formData, participantId);
    onTeamMembersUpdated();
  };

  return (
    <>
      <h1>Team Members</h1>
      <p className='heading-details'>
        View and manage team members who have access to the UID2 Portal.
      </p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: UserResponse[]) => (
            <TeamMembersTable
              teamMembers={users}
              onAddTeamMember={handleAddTeamMember}
              resendInvite={ResendInvite}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members',
  element: <TeamMembers />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsersOfParticipant();
    return defer({ users });
  },
};
