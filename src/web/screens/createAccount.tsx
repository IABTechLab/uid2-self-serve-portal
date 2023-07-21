import { Suspense, useContext } from 'react';
import { Await, defer, useLoaderData, useNavigate } from 'react-router-dom';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { CreateAccountForm } from '../components/Account/CreateAccountForm';
import { Card } from '../components/Core/Card';
import { Loading } from '../components/Core/Loading';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { PortalRoute } from './routeUtils';

export const AccountCreationRoutes: PortalRoute[] = [];

function CreateAccount() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const { participantTypes } = useLoaderData() as { participantTypes: ParticipantType[] };
  const onSubmit = async (data: CreateParticipantForm) => {
    const createResult = await CreateParticipant(data, LoggedInUser!.profile);
    if ('errorStatus' in createResult) {
      return createResult.messages;
    }
    await loadUser();
    navigate('/account/pending');
  };

  return (
    <div className='app-panel app-centralize'>
      <div className='create-account-screen'>
        <Card
          title='Participant Information'
          description='Provide the following information about the company/participant you work for.'
        >
          <Suspense fallback={<Loading />}>
            <h2>Participant Information</h2>
            <Await resolve={participantTypes}>
              {(partTypes: ParticipantType[]) => (
                <CreateAccountForm onSubmit={onSubmit} resolvedParticipantTypes={partTypes} />
              )}
            </Await>
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

export const CreateAccountRoute: PortalRoute = {
  path: '/account/create',
  description: 'Create account',
  element: <CreateAccount />,
  loader: async () => {
    const participantTypes = GetAllParticipantTypes();
    return defer({ participantTypes });
  },
};
