import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { InviteTeamMember } from '../services/participant';
import {
  GetAllUsersOfParticipant,
  InviteTeamMemberForm,
  RemoveUser,
  ResendInvite,
  UpdateUser,
  UserResponse,
} from '../services/userAccount';
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

  const handleRemoveTeamMember = async (userId: number) => {
    await RemoveUser(userId);
    onTeamMembersUpdated();
  };

  const handleUpdateTeamMember = async (userId: number, formData: InviteTeamMemberForm) => {
    await UpdateUser(userId, formData);
    onTeamMembersUpdated();
  };

  return (
    <>
      <h1>Team Members</h1>
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: UserResponse[]) => (
            <TeamMembersTable
              teamMembers={users}
              onAddTeamMember={handleAddTeamMember}
              resendInvite={ResendInvite}
              onRemoveTeamMember={handleRemoveTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
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
