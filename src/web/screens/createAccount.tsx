import { Suspense, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { CreateAccountForm } from '../components/Account/CreateAccountForm';
import { Card } from '../components/Core/Card/Card';
import { Loading } from '../components/Core/Loading/Loading';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { CreateParticipant, CreateParticipantForm } from '../services/participant';
import { GetAllParticipantTypes } from '../services/participantType';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { PortalRoute } from './routeUtils';

export const AccountCreationRoutes: PortalRoute[] = [];
const loader = makeLoader(() => defer({ participantTypes: GetAllParticipantTypes() }));

function CreateAccount() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const { participantTypes } = useLoaderData<typeof loader>();
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
            <AwaitTypesafe resolve={participantTypes}>
              {(partTypes) => (
                <CreateAccountForm onSubmit={onSubmit} resolvedParticipantTypes={partTypes} />
              )}
            </AwaitTypesafe>
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
  loader,
};
