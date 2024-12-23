import { Suspense, useContext, useEffect, useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ParticipantDTO } from '../../api/entities/Participant';
import { Loading } from '../components/Core/Loading/Loading';
import { ErrorToast, SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import AddParticipantDialog from '../components/ParticipantManagement/AddParticipantDialog';
import ParticipantManagementTable from '../components/ParticipantManagement/ParticipantManagementTable';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { GetAllEnabledApiRoles } from '../services/apiKeyService';
import {
  AddParticipant,
  AddParticipantForm,
  GetAllParticipants,
  GetUsersDefaultParticipant,
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
    participants: GetAllParticipants(),
    participantTypes: GetAllParticipantTypes(),
    apiRoles: GetAllEnabledApiRoles(),
  });
});

function ManageParticipants() {
  const [showAddParticipantsDialog, setShowAddParticipantsDialog] = useState<boolean>(false);
  const { participant, setParticipant } = useContext(ParticipantContext);
  const { LoggedInUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!LoggedInUser?.user?.isUid2Support && participant) {
      navigate(`/participant/${participant.id}/home`);
      ErrorToast(`You do not have access to this page. Rerouting back to Home.`);
    }
  });

  const data = useLoaderData<typeof loader>();

  const reloader = useRevalidator();

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
          <p className='heading-details'>View and manage UID2 Portal participants.</p>
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
                  <AwaitTypesafe resolve={data.participants}>
                    {(participants) => (
                      <ParticipantManagementTable
                        participants={participants}
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
