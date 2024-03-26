import { useCallback, useEffect, useState } from 'react';

import { CstgDomainsTable } from '../components/ClientSideTokenGeneration/CstgDomainsTable';
import { ContentContainer } from '../components/Core/ContentContainer';
import { SuccessToast } from '../components/Core/Toast';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { GetDomainNames, UpdateDomainNames } from '../services/domainNamesService';
import { AddKeyPair, AddKeyPairFormProps, GetKeyPairs } from '../services/keyPairService';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

function ClientSideIntegration() {
  const [keyPairData, setKeyPairData] = useState<KeyPairModel[]>();
  const [domainNames, setDomainNames] = useState<string[]>();

  const loadKeyPairs = useCallback(async () => {
    const data = await GetKeyPairs();
    const sortedKeyPairs = data?.sort((a, b) => a.created.getTime() - b.created.getTime());
    setKeyPairData(sortedKeyPairs);
  }, []);

  const loadDomainNames = useCallback(async () => {
    const currentDomainNames = await GetDomainNames();
    setDomainNames(currentDomainNames);
  }, []);

  useEffect(() => {
    loadKeyPairs();
  }, [loadKeyPairs]);

  useEffect(() => {
    loadDomainNames();
  }, [loadDomainNames]);

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

  const handleUpdateDomainNames = async (newDomainNames: string[]) => {
    try {
      const response = await UpdateDomainNames(newDomainNames);
      setDomainNames(response);
      SuccessToast('Domain Names updated.');
    } catch (e) {
      handleErrorToast(e);
    }
  };

  return (
    <>
      <h1>Client Side Integration</h1>
      <p className='heading-details'>
        View and manage Client Side Integration Key Pairs and domain names. For more information,
        see{' '}
        <a
          className='outside-link'
          target='_blank'
          href='https://unifiedid.com/docs/guides/publisher-client-side'
          rel='noreferrer'
        >
          Client-Side Integration Guide
        </a>
        .
      </p>
      <ContentContainer>
        <KeyPairsTable keyPairs={keyPairData ?? []} onAddKeyPair={handleAddKeyPair} />
        {domainNames && (
          <CstgDomainsTable domains={domainNames} onUpdateDomains={handleUpdateDomainNames} />
        )}
      </ContentContainer>
    </>
  );
}

export const ClientSideIntegrationRoute: PortalRoute = {
  description: 'Client Side Integration',
  element: <ClientSideIntegration />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/clientSideIntegration',
};
