import { Suspense, useCallback, useEffect, useState } from 'react';

import { Loading } from '../components/Core/Loading';
import { StatusNotificationType, StatusPopup } from '../components/Core/StatusPopup';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { AddKeyPair, AddKeyPairFormProps, GetKeyPairs } from '../services/keyPairService';
import { ApiError } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function KeyPairsScreen() {
  const [keyPairData, setKeyPairData] = useState<KeyPairModel[]>();
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);
  const [statusPopup, setStatusPopup] = useState<StatusNotificationType>();

  const loadKeyPairs = useCallback(async () => {
    const data = await GetKeyPairs();
    const sortedKeyPairs = data?.sort((a, b) => a.created.getTime() - b.created.getTime());
    setKeyPairData(sortedKeyPairs);
  }, []);

  useEffect(() => {
    loadKeyPairs();
  }, [loadKeyPairs]);

  const handleErrorPopup = (e: Error) => {
    const hasHash = Object.hasOwn(e, 'errorHash') && (e as ApiError).errorHash;
    const hash = hasHash ? `: (${(e as ApiError).errorHash})` : '';
    setStatusPopup({
      type: 'Error',
      message: `${e.message}${hash}`,
    });
    setShowStatusPopup(true);
    throw new Error(e.message);
  };

  const handleSuccessPopup = (message: string) => {
    setStatusPopup({
      type: 'Success',
      message,
    });
    setShowStatusPopup(true);
  };

  const handleAddKeyPair = async (formData: AddKeyPairFormProps) => {
    const { name, disabled = false } = formData;
    try {
      const response = await AddKeyPair({ name, disabled });
      if (response.status === 201) {
        handleSuccessPopup('Key Pair added.');
        loadKeyPairs();
      }
    } catch (e: unknown) {
      handleErrorPopup(e as Error);
    }
  };

  return (
    <>
      <h1>Client Side Integration</h1>
      <p className='heading-details'>View and manage Keys.</p>
      <Suspense fallback={<Loading />}>
        <KeyPairsTable keyPairs={keyPairData} onAddKeyPair={handleAddKeyPair} />
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
  description: 'Client Side Integration',
  element: <KeyPairsScreen />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/keyPairs',
};
