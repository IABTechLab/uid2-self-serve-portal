import { Suspense } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { SignedParticipantDTO } from '../../api/entities/SignedParticipant';
import { Loading } from '../components/Core/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { SignedParticipantsTable } from '../components/SignedParticipants/SignedParticipantsTable';
import { GetSignedParticipants } from '../services/participant';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

export function SignedParticipants() {
  const data = useLoaderData() as { signedParticipants: SignedParticipantDTO[] };

  return (
    <>
      <h1>Signed Participants</h1>
      <p className='heading-details'>Participants that have signed the UID2 Participation Policy.</p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading />}>
          <Await resolve={data.signedParticipants}>
            {(signedParticipants: SignedParticipantDTO[]) => (
              <SignedParticipantsTable signedParticipants={signedParticipants} />
            )}
          </Await>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const SignedParticipantsRoute: PortalRoute = {
  path: '/dashboard/signedParticipants',
  description: 'Signed Participants',
  element: <SignedParticipants />,
  errorElement: <RouteErrorBoundary />,
  loader: async () => {
    const signedParticipants = GetSignedParticipants();
    return defer({ signedParticipants });
  },
};
