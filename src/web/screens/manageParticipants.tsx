import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ParticipantDTO } from '../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../api/routers/participantsRouter';
import { AdminSiteDTO } from '../../api/services/adminServiceHelpers';
import { Loading } from '../components/Core/Loading';
import AddParticipantDialog from '../components/ParticipantManagement/AddParticipantDialog';
import { ApprovedParticipantsTable } from '../components/ParticipantManagement/ApprovedParticipantsTable';
import { ParticipantRequestsTable } from '../components/ParticipantManagement/ParticipantRequestsTable';
import { GetAllEnabledApiRoles } from '../services/apiKeyService';
import {
  AddParticipant,
  AddParticipantForm,
  ApproveParticipantRequest,
  GetApprovedParticipants,
  GetParticipantsAwaitingApproval,
  ParticipantApprovalFormDetails,
  UpdateParticipant,
  UpdateParticipantForm,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import '../components/ParticipantManagement/ParticipantManagement.scss';

function ManageParticipants() {
  const data = useLoaderData() as {
    results: [
      ParticipantRequestDTO[],
      ParticipantDTO[],
      ParticipantTypeDTO[],
      ApiRoleDTO[],
      AdminSiteDTO[],
      string[]
    ];
  };

  const reloader = useRevalidator();
  const handleParticipantUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleApproveParticipantRequest = async (
    participantId: number,
    formData: ParticipantApprovalFormDetails
  ) => {
    await ApproveParticipantRequest(participantId, formData);
    handleParticipantUpdated();
  };

  const onUpdateParticipant = async (form: UpdateParticipantForm, participant: ParticipantDTO) => {
    await UpdateParticipant(form, participant.id);
    handleParticipantUpdated();
  };

  const onAddParticipant = async (form: AddParticipantForm) => {
    await AddParticipant(form);
    handleParticipantUpdated();
  };

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.results}>
          {([participantRequests, participantApproved, participantTypes, apiRoles]: [
            ParticipantRequestDTO[],
            ParticipantDTO[],
            ParticipantTypeDTO[],
            ApiRoleDTO[],
            string[]
          ]) => (
            <>
              <div className='manage-participants-header'>
                <div className='manage-participants-header-left'>
                  <h1>Manage Participants</h1>
                  <p className='heading-details'>
                    View and manage UID2 Portal participant requests and information.
                  </p>
                </div>
                <div className='manage-participants-header-right'>
                  <AddParticipantDialog
                    apiRoles={apiRoles}
                    participantTypes={participantTypes}
                    onAddParticipant={onAddParticipant}
                    triggerButton={<button type='button'>Add Participant</button>}
                  />
                </div>
              </div>
              <ParticipantRequestsTable
                participantRequests={participantRequests}
                participantTypes={participantTypes}
                apiRoles={apiRoles}
                onApprove={handleApproveParticipantRequest}
              />
              <ApprovedParticipantsTable
                participants={participantApproved}
                apiRoles={apiRoles}
                onUpdateParticipant={onUpdateParticipant}
              />
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
    const apiRoles = GetAllEnabledApiRoles();
    const promises = Promise.all([
      participantsAwaitingApproval,
      participantsApproved,
      participantTypes,
      apiRoles,
    ]);
    return defer({
      results: promises,
    });
  },
};
