import { Suspense } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { Participant } from '../../api/entities/Participant';
import { ApprovalsTable } from '../components/Approvals/ApprovalsTable';
import { Loading } from '../components/Core/Loading';
import { GetParticipantsAwaitingApproval } from '../services/participant';
import { PortalRoute } from './routeUtils';

function Approvals() {
  const { participantsAwaitingApproval } = useLoaderData() as {
    participantsAwaitingApproval: Participant[];
  };

  return (
    <div>
      <h1>Participant Information</h1>
      <h2>Participant Requests</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={participantsAwaitingApproval}>
          {(participants: Participant[]) => <ApprovalsTable participants={participants} />}
        </Await>
      </Suspense>
    </div>
  );
}

export const ApprovalsRoute: PortalRoute = {
  path: '/dashboard/approvals',
  description: 'Participant Information',
  element: <Approvals />,
  loader: async () => {
    const participantsAwaitingApproval = await GetParticipantsAwaitingApproval();
    return defer({
      participantsAwaitingApproval,
    });
  },
};
