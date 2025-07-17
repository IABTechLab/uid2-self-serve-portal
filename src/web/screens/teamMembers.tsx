import { Suspense, useContext } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { InviteTeamMember, UpdatePrimaryContact } from '../services/participant';
import {
  GetAllUsersOfParticipant,
  InviteTeamMemberForm,
  RemoveUser,
  ResendInvite,
  UpdateTeamMemberForm,
  UpdateUser,
} from '../services/userAccount';
import { handleErrorToast } from '../utils/apiError';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { makeParticipantLoader } from '../utils/loaderHelpers';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = makeParticipantLoader((participantId) => {
  const users = GetAllUsersOfParticipant(participantId);
  return defer({ users });
});

function TeamMembers() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const data = useLoaderData<typeof loader>();
  const { participant, loadParticipant } = useContext(ParticipantContext);
  const reloader = useRevalidator();

  const handleAddTeamMember = async (formData: InviteTeamMemberForm) => {
    try {
      const response = await InviteTeamMember(formData, participant!.id);
      const { user } = response.data as { user: { id: number } };
      if (response.status === 201) {
        if (formData.setPrimaryContact) {
          await UpdatePrimaryContact(participant!.id, user.id);
          await loadParticipant();
        }
        SuccessToast('Team member added.');
      }

      reloader.revalidate();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleRemoveTeamMember = async (userId: number) => {
    try {
      const response = await RemoveUser(userId, participant!.id);
      if (response.status === 200) {
        SuccessToast('Team member removed.');
      }
      reloader.revalidate();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleUpdateTeamMember = async (
    userId: number,
    formData: UpdateTeamMemberForm,
    hasUserFieldsChanged: boolean
  ) => {
    try {
      if (hasUserFieldsChanged) {
        const response = await UpdateUser(userId, formData, participant!.id);
        if (response.status === 200) {
          SuccessToast('Team member updated.');
        }
      }

      if (formData.setPrimaryContact && userId !== participant?.primaryContact?.id) {
        await UpdatePrimaryContact(participant!.id, userId);
        await loadParticipant();
      }

      reloader.revalidate();
      if (LoggedInUser?.user?.id === userId) await loadUser();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  return (
    <>
      <h1>Team Members</h1>
      <p className='heading-details'>
        View and manage team members who have access to the UID2 Portal.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading team data...' />}>
          <AwaitTypesafe resolve={data.users}>
            {(users) => (
              <TeamMembersTable
                teamMembers={users}
                onAddTeamMember={handleAddTeamMember}
                resendInvite={ResendInvite}
                onRemoveTeamMember={handleRemoveTeamMember}
                onUpdateTeamMember={handleUpdateTeamMember}
              />
            )}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Manage Team Members',
  element: <TeamMembers />,
  errorElement: <RouteErrorBoundary />,
  path: '/participant/:participantId/team',
  loader,
  isHidden: true,
};
