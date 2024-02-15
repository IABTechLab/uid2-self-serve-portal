import { Suspense, useCallback, useEffect, useState } from 'react';

import { Loading } from '../components/Core/Loading';
import { SuccessToast } from '../components/Core/Toast';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { AddKeyPair, AddKeyPairFormProps, GetKeyPairs } from '../services/keyPairService';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function KeyPairsScreen() {
  const [keyPairData, setKeyPairData] = useState<KeyPairModel[]>();

  const loadKeyPairs = useCallback(async () => {
    const data = await GetKeyPairs();
    const sortedKeyPairs = data?.sort((a, b) => a.created.getTime() - b.created.getTime());
    setKeyPairData(sortedKeyPairs);
  }, []);

  useEffect(() => {
    loadKeyPairs();
  }, [loadKeyPairs]);

  const handleAddKeyPair = async (formData: AddKeyPairFormProps) => {
    const { name, disabled = false } = formData;
    try {
      const response = await AddKeyPair({ name, disabled });
      if (response.status === 201) {
        SuccessToast('Key Pair added.');
        loadKeyPairs();
      }
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  return (
    <>
      <h1>Client Side Integration</h1>
      <p className='heading-details'>View and manage Keys.</p>
      <Suspense fallback={<Loading />}>
        <KeyPairsTable keyPairs={keyPairData} onAddKeyPair={handleAddKeyPair} />
      </Suspense>
    </>
  );
}

export const KeyPairRoute: PortalRoute = {
  description: 'Client Side Integration',
  element: <KeyPairsScreen />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/keyPairs',
};
