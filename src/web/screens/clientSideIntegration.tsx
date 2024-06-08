import { useCallback, useEffect, useState } from 'react';

import { ClientSideCompletion } from '../components/ClientSideCompletion/ClientSideCompletion';
import { UpdateDomainNamesResponse } from '../components/ClientSideTokenGeneration/CstgDomainHelper';
import CstgDomainsTable from '../components/ClientSideTokenGeneration/CstgDomainsTable';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { SuccessToast } from '../components/Core/Toast';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { GetDomainNames, UpdateDomainNames } from '../services/domainNamesService';
import {
  AddKeyPair,
  AddKeyPairFormProps,
  DisableKeyPair,
  GetKeyPairs,
  UpdateKeyPair,
  UpdateKeyPairFormProps,
} from '../services/keyPairService';
import { handleErrorToast } from '../utils/apiError';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { separateStringsList, sortStringsAlphabetically } from '../utils/textHelpers';
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
    const currentDomainNamesSorted = currentDomainNames
      ? sortStringsAlphabetically(currentDomainNames)
      : currentDomainNames;
    setDomainNames(currentDomainNamesSorted);
  }, []);

  useEffect(() => {
    loadKeyPairs();
  }, [loadKeyPairs]);

  useEffect(() => {
    loadDomainNames();
  }, [loadDomainNames]);

  const handleAddKeyPair = async (formData: AddKeyPairFormProps) => {
    const { name } = formData;
    try {
      const response = await AddKeyPair({ name });
      if (response.status === 201) {
        SuccessToast('Key pair added.');
        loadKeyPairs();
      }
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleUpdateKeyPair = async (formData: UpdateKeyPairFormProps) => {
    const { name, subscriptionId, disabled = false } = formData;
    try {
      await UpdateKeyPair({ name, subscriptionId, disabled });
      SuccessToast('Key Pair updated.');
      loadKeyPairs();
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleDisableKeyPair = async (keyPair: KeyPairModel) => {
    try {
      await DisableKeyPair(keyPair);
      SuccessToast('Key pair deleted.');
      loadKeyPairs();
    } catch (e) {
      handleErrorToast(e);
    }
  };
  const handleUpdateDomainNames = async (
    updatedDomainNames: string[],
    action: string
  ): Promise<UpdateDomainNamesResponse | undefined> => {
    try {
      const response = await UpdateDomainNames(updatedDomainNames);
      let domains = response?.domains;
      const isValidDomains = response?.isValidDomains;
      if (!isValidDomains) {
        const invalidDomains = separateStringsList(domains[0]);
        domains = invalidDomains;
      } else {
        setDomainNames(sortStringsAlphabetically(domains));
        SuccessToast(`Domain names ${action}.`);
      }
      const updatedDomainNamesResponse: UpdateDomainNamesResponse = {
        domains,
        isValidDomains,
      };
      return updatedDomainNamesResponse;
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onAddDomainNames = async (newDomains: string[], deleteExistingList: boolean) => {
    let updatedDomains = newDomains;
    if (domainNames && !deleteExistingList) updatedDomains = [...newDomains, ...domainNames];
    return handleUpdateDomainNames(updatedDomains, 'added');
  };

  return (
    <>
      <h1>Client-Side Integration</h1>
      <p className='heading-details'>
        View and manage client-side integration key pairs and domain names.
        {/* For more information,
        see{' '}
        <a
          className='outside-link'
          target='_blank'
          href='https://unifiedid.com/docs/guides/publisher-client-side'
          rel='noreferrer'
        >
          Client-Side Integration Guide for JavaScript
        </a>
        . */}
      </p>
      <ScreenContentContainer>
        <ClientSideCompletion domainNames={domainNames} keyPairData={keyPairData} />
        <KeyPairsTable
          keyPairs={keyPairData}
          onAddKeyPair={handleAddKeyPair}
          onKeyPairEdit={handleUpdateKeyPair}
          onKeyPairDisable={handleDisableKeyPair}
        />
        <CstgDomainsTable
          domains={domainNames || []}
          onAddDomains={onAddDomainNames}
          onUpdateDomains={handleUpdateDomainNames}
        />
      </ScreenContentContainer>
    </>
  );
}

export const ClientSideIntegrationRoute: PortalRoute = {
  description: 'Client-Side Integration',
  element: <ClientSideIntegration />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/clientSideIntegration',
};
