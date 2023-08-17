import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../api/routers/participantsRouter';
import { SiteDTO } from '../../api/services/adminServiceClient';
import { Loading } from '../components/Core/Loading';
import { ParticipantRequestsTable } from '../components/ParticipantRequests/ParticipantRequestsTable';
import {
  ApproveParticipantRequest,
  GetParticipantsAwaitingApproval,
  ParticipantApprovalFormDetails,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { preloadSiteList } from '../services/site';
import { PortalRoute } from './routeUtils';

function ManageParticipants() {
  const data = useLoaderData() as {
    results: [ParticipantRequestDTO[], ParticipantTypeDTO[], SiteDTO[]];
  };

  const reloader = useRevalidator();
  const onParticipantRequestsUpdate = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleApproveParticipantRequest = async (
    participantId: number,
    formData: ParticipantApprovalFormDetails
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
    const sitesList = preloadSiteList();
    const promises = Promise.all([participantsAwaitingApproval, participantTypes, sitesList]);
    return defer({
      results: promises,
    });
  },
};
