import { Suspense, useContext, useState } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ParticipantDTO } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast, WarningToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import AddParticipantDialog from '../components/ParticipantManagement/AddParticipantDialog';
import ApprovedParticipantsTable from '../components/ParticipantManagement/ApprovedParticipantsTable';
import { ParticipantRequestsTable } from '../components/ParticipantManagement/ParticipantRequestsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { GetAllEnabledApiRoles } from '../services/apiKeyService';
import {
  AddParticipant,
  AddParticipantForm,
  ApproveParticipantRequest,
  GetApprovedParticipants,
  GetParticipantsAwaitingApproval,
  GetUsersDefaultParticipant,
  ParticipantApprovalFormDetails,
  UpdateParticipant,
  UpdateParticipantForm,
} from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { AwaitTypesafe, resolveAll } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './manageParticipants.scss';

const loader = makeLoader(() => {
  return defer({
    participantsAwaitingApproval: GetParticipantsAwaitingApproval(),
    participantsApproved: GetApprovedParticipants(),
    participantTypes: GetAllParticipantTypes(),
    apiRoles: GetAllEnabledApiRoles(),
  });
});

function ManageParticipants() {
  const [showAddParticipantsDialog, setShowAddParticipantsDialog] = useState<boolean>(false);
  const { participant, setParticipant } = useContext(ParticipantContext);

  const data = useLoaderData<typeof loader>();

  const reloader = useRevalidator();

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
    reloader.revalidate();
  };

  const onUpdateParticipant = async (
    form: UpdateParticipantForm,
    updatedParticipant: ParticipantDTO
  ) => {
    await UpdateParticipant(form, updatedParticipant.id);
    // if updating the current user's participant, update the ParticipantContext
    if (updatedParticipant.id === participant?.id) {
      const p = await GetUsersDefaultParticipant();
      setParticipant(p);
    }
    SuccessToast('Participant updated.');
    reloader.revalidate();
  };

  const onAddParticipant = async (form: AddParticipantForm) => {
    const response = await AddParticipant(form);
    reloader.revalidate();
    return response;
  };

  const onOpenChangeAddParticipantDialog = () => {
    setShowAddParticipantsDialog(!showAddParticipantsDialog);
  };

  return (
    <div>
      <div className='manage-participants-header'>
        <div className='manage-participants-header-left'>
          <h1>Manage Participants</h1>
          <p className='heading-details'>
            View and manage UID2 Portal participant requests and information.
          </p>
        </div>
        <div className='manage-participants-header-right'>
          <button type='button' onClick={onOpenChangeAddParticipantDialog}>
            Add Participant
          </button>
        </div>
      </div>
      <ScreenContentContainer>
        <Suspense fallback={<Loading />}>
          <AwaitTypesafe
            resolve={resolveAll({
              participantTypes: data.participantTypes,
              apiRoles: data.apiRoles,
            })}
          >
            {(loadedData) => (
              <>
                {showAddParticipantsDialog && (
                  <AddParticipantDialog
                    apiRoles={loadedData.apiRoles}
                    participantTypes={loadedData.participantTypes}
                    onAddParticipant={onAddParticipant}
                    onOpenChange={onOpenChangeAddParticipantDialog}
                  />
                )}
                <Suspense fallback={<Loading />}>
                  <AwaitTypesafe resolve={data.participantsAwaitingApproval}>
                    {(participantsAwaitingApproval) => (
                      <ParticipantRequestsTable
                        participantRequests={participantsAwaitingApproval}
                        participantTypes={loadedData.participantTypes}
                        apiRoles={loadedData.apiRoles}
                        onApprove={handleApproveParticipantRequest}
                      />
                    )}
                  </AwaitTypesafe>
                </Suspense>
                <Suspense fallback={<Loading />}>
                  <AwaitTypesafe resolve={data.participantsApproved}>
                    {(participantsApproved) => (
                      <ApprovedParticipantsTable
                        participants={participantsApproved}
                        apiRoles={loadedData.apiRoles}
                        participantTypes={loadedData.participantTypes}
                        onUpdateParticipant={onUpdateParticipant}
                      />
                    )}
                  </AwaitTypesafe>
                </Suspense>
              </>
            )}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </div>
  );
}

export const ManageParticipantsRoute: PortalRoute = {
  path: '/participant/:participantId/manageParticipants',
  description: 'Manage Participants',
  element: <ManageParticipants />,
  errorElement: <RouteErrorBoundary />,
  loader,
};
