import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ParticipantDTO } from '../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../api/routers/participantsRouter';
import { SiteDTO } from '../../api/services/adminServiceHelpers';
import { Loading } from '../components/Core/Loading';
import { ApprovedParticipantsTable } from '../components/ParticipantManagement/ApprovedParticipantsTable';
import { ParticipantRequestsTable } from '../components/ParticipantManagement/ParticipantRequestsTable';
import {
  ApproveParticipantRequest,
  GetApprovedParticipants,
  GetParticipantsAwaitingApproval,
  ParticipantApprovalFormDetails,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { preloadSiteList } from '../services/site';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function ManageParticipants() {
  const data = useLoaderData() as {
    results: [ParticipantRequestDTO[], ParticipantDTO[], ParticipantTypeDTO[], SiteDTO[]];
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
          {([participantRequests, participantApproved, participantTypes]: [
            ParticipantRequestDTO[],
            ParticipantDTO[],
            ParticipantTypeDTO[]
          ]) => (
            <>
              <ParticipantRequestsTable
                participantRequests={participantRequests}
                participantTypes={participantTypes}
                onApprove={handleApproveParticipantRequest}
              />
              <ApprovedParticipantsTable participants={participantApproved} />
            </>
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
  errorElement: <RouteErrorBoundary />,
  loader: async () => {
    const participantsAwaitingApproval = GetParticipantsAwaitingApproval();
    const participantsApproved = GetApprovedParticipants();
    const participantTypes = GetAllParticipantTypes();
    const sitesList = preloadSiteList();
    const promises = Promise.all([
      participantsAwaitingApproval,
      participantsApproved,
      participantTypes,
      sitesList,
    ]);
    return defer({
      results: promises,
    });
  },
};
