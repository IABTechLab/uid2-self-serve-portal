import { Suspense } from 'react';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { Loading } from '../components/Core/Loading/Loading';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
import { SignedParticipantsTable } from '../components/SignedParticipants/SignedParticipantsTable';
import { GetSignedParticipants } from '../services/participant';
import { AwaitTypesafe } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

const loader = makeLoader(() => {
  const signedParticipants = GetSignedParticipants();
  return defer({ signedParticipants });
});

export function SignedParticipants() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Signed Participants</h1>
      <p className='heading-details'>
        Participants that have signed the UID2 Participation Policy.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading />}>
          <AwaitTypesafe resolve={data.signedParticipants}>
            {(signedParticipants) => (
              <SignedParticipantsTable signedParticipants={signedParticipants} />
            )}
          </AwaitTypesafe>
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
  loader,
};
