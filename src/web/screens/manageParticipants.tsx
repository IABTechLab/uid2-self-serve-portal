import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../api/participantsRouter';
import { Loading } from '../components/Core/Loading';
import { ParticipantRequestsTable } from '../components/ParticipantRequests/ParticipantRequestsTable';
import {
  ApproveParticipantRequest,
  GetParticipantsAwaitingApproval,
  ParticipantApprovalForm,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

function ManageParticipants() {
  const data = useLoaderData() as {
    results: [ParticipantRequestDTO[], ParticipantTypeDTO[]];
  };

  const reloader = useRevalidator();
  const onParticipantRequestsUpdate = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleApproveParticipantRequest = async (
    participantId: number,
    formData: ParticipantApprovalForm
  ) => {
    await ApproveParticipantRequest(participantId, formData);
    onParticipantRequestsUpdate();
  };

  return (
    <div>
      <h1>Manage Participants</h1>
      <p className='heading-details'>
        View and manage UID2 Portal participant requests and information.
      </p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.results}>
          {([participantRequests, participantTypes]: [
            ParticipantRequestDTO[],
            ParticipantTypeDTO[]
          ]) => (
            <ParticipantRequestsTable
              participantRequests={participantRequests}
              participantTypes={participantTypes}
              onApprove={handleApproveParticipantRequest}
            />
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
    const participantsAwaitingApproval = GetParticipantsAwaitingApproval();
    const participantTypes = GetAllParticipantTypes();
    const promises = Promise.all([participantsAwaitingApproval, participantTypes]);
    return defer({
      results: promises,
    });
  },
};
