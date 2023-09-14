import { Suspense, useCallback, useContext, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
// import TeamMembersTable from '../components/TeamMember/TeamMembersTable';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { GetKeyPairs } from '../services/keyPairsServices';
// import { ParticipantContext } from '../contexts/ParticipantProvider';
// import { InviteTeamMember } from '../services/participant';
// import {
//   GetAllUsersOfParticipant,
//   InviteTeamMemberForm,
//   RemoveUser,
//   ResendInvite,
//   UpdateTeamMemberForm,
//   UpdateUser,
//   UserResponse,
// } from '../services/userAccount';
// import { ApiError } from '../utils/apiError';
import { PortalRoute } from './routeUtils';

function Loading() {
  return <div>Loading tokens and keys...</div>;
}

function TeamMembers() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const data = useLoaderData() as { keyPairs: string }; // as { users: UserResponse[] };
  // const data = useLoaderData() as { users: UserResponse[] };
  // const { participant } = useContext(ParticipantContext);
  // const reloader = useRevalidator();
  // const onTeamMembersUpdated = useCallback(() => {
  //   reloader.revalidate();
  // }, [reloader]);
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  // const handleErrorPopup = (e: Error) => {
  //   const hasHash = Object.hasOwn(e, 'errorHash') && (e as ApiError).errorHash;
  //   const hash = hasHash ? `: (${(e as ApiError).errorHash})` : '';
  //   setStatusPopup({
  //     type: 'Error',
  //     message: `${e.message}${hash}`,
  //   });
  //   setShowStatusPopup(true);
  //   throw new Error(e.message);
  // };

  // const handleSuccessPopup = (message: string) => {
  //   setStatusPopup({
  //     type: 'Success',
  //     message,
  //   });
  //   setShowStatusPopup(true);
  // };

  // const handleAddTeamMember = async (formData: InviteTeamMemberForm) => {
  //   const response = await InviteTeamMember(formData, participant!.id);
  //   if (response.statusText === 'Created') {
  //     handleSuccessPopup('Team member added.');
  //   }
  //   onTeamMembersUpdated();
  // };

  // const handleRemoveTeamMember = async (userId: number) => {
  //   try {
  //     const response = await RemoveUser(userId);
  //     if (response.statusText === 'OK') {
  //       handleSuccessPopup('Team member removed.');
  //     }
  //     onTeamMembersUpdated();
  //   } catch (e: unknown) {
  //     handleErrorPopup(e as Error);
  //   }
  // };

  // const handleUpdateTeamMember = async (userId: number, formData: UpdateTeamMemberForm) => {
  //   try {
  //     const response = await UpdateUser(userId, formData);
  //     if (response.statusText === 'OK') {
  //       handleSuccessPopup('Team member updated.');
  //     }
  //     onTeamMembersUpdated();
  //     if (LoggedInUser?.user?.id === userId) await loadUser();
  //   } catch (e: unknown) {
  //     handleErrorPopup(e as Error);
  //   }
  // };

  return (
    <>
      <h1>Key Pairs</h1>
      <p className='heading-details'>View and manage Tokens and Keys.</p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.keyPairs}>
          {(keyPairs) => <h4>{keyPairs}</h4>}
          {/* {(users: UserResponse[]) => (
            <TeamMembersTable
              teamMembers={users}
              onAddTeamMember={handleAddTeamMember}
              resendInvite={ResendInvite}
              onRemoveTeamMember={handleRemoveTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
            />
          )} */}
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

export const TokenKeysRoute: PortalRoute = {
  description: 'Token Keys',
  element: <TeamMembers />,
  path: '/dashboard/keyPairs',
  loader: () => {
    const keyPairs = GetKeyPairs();
    return defer({ keyPairs });
  },
};
