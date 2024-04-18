import { Suspense, useCallback } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ParticipantDTO } from '../../api/entities/Participant';
import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { ParticipantRequestDTO } from '../../api/routers/participants/participantsRouter';
import { Loading } from '../components/Core/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { SuccessToast, WarningToast } from '../components/Core/Toast';
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

import './manageParticipants.scss';

function ManageParticipants() {
  const data = useLoaderData() as {
    results: [ParticipantRequestDTO[], ParticipantDTO[], ParticipantTypeDTO[], ApiRoleDTO[]];
  };

  const reloader = useRevalidator();
  const handleParticipantUpdated = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);

  const handleApproveParticipantRequest = async (
    participantId: number,
    formData: ParticipantApprovalFormDetails
  ) => {
    const approvalResponse = await ApproveParticipantRequest(participantId, formData);
    if (approvalResponse?.users?.length === 0) {
      WarningToast(
        'Participant approved. Since no users are attached to participant, email confirmation sent to approver.'
      );
    }
    handleParticipantUpdated();
  };

  const onUpdateParticipant = async (form: UpdateParticipantForm, participant: ParticipantDTO) => {
    await UpdateParticipant(form, participant.id);
    SuccessToast('Participant updated');
    handleParticipantUpdated();
  };

  const onAddParticipant = async (form: AddParticipantForm) => {
    const response = await AddParticipant(form);
    handleParticipantUpdated();
    return response;
  };

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.results}>
          {([participantRequests, participantApproved, participantTypes, apiRoles]: [
            ParticipantRequestDTO[],
            ParticipantDTO[],
            ParticipantTypeDTO[],
            ApiRoleDTO[]
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
              <ScreenContentContainer>
                <ParticipantRequestsTable
                  participantRequests={participantRequests}
                  participantTypes={participantTypes}
                  apiRoles={apiRoles}
                  onApprove={handleApproveParticipantRequest}
                />
                <ApprovedParticipantsTable
                  participants={participantApproved}
                  apiRoles={apiRoles}
                  participantTypes={participantTypes}
                onUpdateParticipant={onUpdateParticipant}
                />
              </ScreenContentContainer>
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
