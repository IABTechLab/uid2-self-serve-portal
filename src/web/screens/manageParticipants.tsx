import { Suspense } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { ParticipantRequestDTO } from '../../api/participantsRouter';
import { Loading } from '../components/Core/Loading';
import { ParticipantRequestsTable } from '../components/ParticipantRequests/ParticipantRequestsTable';
import { GetParticipantsAwaitingApproval } from '../services/participant';
import { PortalRoute } from './routeUtils';

function ManageParticipants() {
  const { participantsAwaitingApproval } = useLoaderData() as {
    participantsAwaitingApproval: ParticipantRequestDTO[];
  };

  return (
    <div>
      <h1>Manage Participants</h1>
      <p>View and manage UID2 Portal participant requests and information.</p>
      <h2>Participant Requests</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={participantsAwaitingApproval}>
          {(participantRequests: ParticipantRequestDTO[]) => (
            <ParticipantRequestsTable participantRequests={participantRequests} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export const ManageParticipantsRoute: PortalRoute = {
  path: '/dashboard/manageParticipants',
  description: 'Manage Participants',
  element: <ManageParticipants />,
  loader: async () => {
    const participantsAwaitingApproval = await GetParticipantsAwaitingApproval();
    return defer({
      participantsAwaitingApproval,
    });
  },
};
