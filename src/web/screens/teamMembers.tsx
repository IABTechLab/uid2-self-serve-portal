import { Suspense, useCallback, useContext } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { InviteTeamMember } from '../services/participant';
import {
  GetAllUsersOfParticipant,
  InviteTeamMemberForm,
  RemoveUser,
  ResendInvite,
  UpdateTeamMemberForm,
  UpdateUser,
  UserResponse,
} from '../services/userAccount';
import { PortalRoute } from './routeUtils';

function Loading() {
  return <div>Loading team data...</div>;
}

function TeamMembers() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const data = useLoaderData() as { users: UserResponse[] };
  const { participant } = useContext(ParticipantContext);
  const reloader = useRevalidator();
  const onTeamMembersUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleAddTeamMember = async (formData: InviteTeamMemberForm) => {
    await InviteTeamMember(formData, participant!.id);
    onTeamMembersUpdated();
  };

  const handleRemoveTeamMember = async (userId: number) => {
    await RemoveUser(userId);
    onTeamMembersUpdated();
  };

  const handleUpdateTeamMember = async (userId: number, formData: UpdateTeamMemberForm) => {
    await UpdateUser(userId, formData);
    if (LoggedInUser?.user?.id === userId) await loadUser();
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
