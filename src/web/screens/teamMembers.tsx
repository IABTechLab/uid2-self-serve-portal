import { Suspense, useCallback, useContext, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
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
import { handleErrorPopup } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
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
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  const handleSuccessPopup = (message: string) => {
    setStatusPopup({
      type: 'Success',
      message,
    });
    setShowStatusPopup(true);
  };

  const handleAddTeamMember = async (formData: InviteTeamMemberForm) => {
    try {
      const response = await InviteTeamMember(formData, participant!.id);
      if (response.status === 201) {
        handleSuccessPopup('Team member added.');
      }
      onTeamMembersUpdated();
    } catch (e: unknown) {
      handleErrorPopup(e as Error, setStatusPopup, setShowStatusPopup);
    }
  };

  const handleRemoveTeamMember = async (userId: number) => {
    try {
      const response = await RemoveUser(userId);
      if (response.status === 200) {
        handleSuccessPopup('Team member removed.');
      }
      onTeamMembersUpdated();
    } catch (e: unknown) {
      handleErrorPopup(e as Error, setStatusPopup, setShowStatusPopup);
    }
  };

  const handleUpdateTeamMember = async (userId: number, formData: UpdateTeamMemberForm) => {
    try {
      const response = await UpdateUser(userId, formData);
      if (response.status === 200) {
        handleSuccessPopup('Team member updated.');
      }
      onTeamMembersUpdated();
      if (LoggedInUser?.user?.id === userId) await loadUser();
    } catch (e: unknown) {
      handleErrorPopup(e as Error, setStatusPopup, setShowStatusPopup);
    }
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
      {statusPopup && (
        <StatusPopup
          status={statusPopup!.type}
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={statusPopup!.message}
        />
      )}
    </>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members',
  element: <TeamMembers />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsersOfParticipant();
    return defer({ users });
  },
};
