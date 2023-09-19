import { Suspense, useState } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { GetKeyPairs } from '../services/keyPairsServices';
import { PortalRoute } from './routeUtils';

function Loading() {
  return <div>Loading key pairs...</div>;
}

function KeyPairs() {
  const data = useLoaderData() as { keyPairs: string }; // as { users: UserResponse[] };
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  return (
    <>
      <h1>Key Pairs</h1>
      <p className='heading-details'>View and manage Key Pairs.</p>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.keyPairs}>
          {(keyPairs: KeyPairModel[]) => <KeyPairsTable keyPairs={keyPairs} />}
        </Await>
      </Suspense>
      {statusPopup && (
        <StatusPopup
          status={statusPopup!.type}
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={statusPopup!.message}
        />
      )}
    </>
  );
}

export const KeyPairRoute: PortalRoute = {
  description: 'Key Pairs',
  element: <KeyPairs />,
  path: '/dashboard/keyPairs',
  loader: () => {
    const keyPairs = GetKeyPairs();
    return defer({ keyPairs });
  },
};
