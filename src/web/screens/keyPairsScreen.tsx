import { Suspense, useCallback, useContext, useEffect, useState } from 'react';

import { Loading } from '../components/Core/Loading';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { GetKeyPairs } from '../services/keyPairService';
import { PortalRoute } from './routeUtils';

function KeyPairs() {
  const { participant } = useContext(ParticipantContext);
  const [keyPairData, setKeyPairData] = useState<KeyPairModel[]>();

  const loadKeyPairs = useCallback(async () => {
    const data = await GetKeyPairs(participant!.siteId!);
    setKeyPairData(data);
  }, [participant]);

  useEffect(() => {
    loadKeyPairs();
  }, [loadKeyPairs]);

  return (
    <>
      <h1>Client Side Integration</h1>
      <p className='heading-details'>View and manage Keys.</p>
      <Suspense fallback={<Loading />}>
        <KeyPairsTable keyPairs={keyPairData} />
      </Suspense>
    </>
  );
}

export const KeyPairRoute: PortalRoute = {
  description: 'Client Side Integration',
  element: <KeyPairs />,
  path: '/dashboard/keyPairs',
};
