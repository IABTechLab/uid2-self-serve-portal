import { useCallback, useEffect, useState } from 'react';

import { ClientSideCompletion } from '../components/ClientSideCompletion/ClientSideCompletion';
import {
  CstgValueType,
  getUniqueAppIds,
  getUniqueDomains,
  UpdateCstgValuesResponse,
} from '../components/ClientSideTokenGeneration/CstgHelper';
import { CstgTable } from '../components/ClientSideTokenGeneration/CstgTable';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer';
import { SuccessToast } from '../components/Core/Toast';
import { KeyPairModel } from '../components/KeyPairs/KeyPairModel';
import KeyPairsTable from '../components/KeyPairs/KeyPairsTable';
import { GetAppIds, UpdateAppIds } from '../services/appIdsService';
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
  const [appIds, setAppIds] = useState<string[]>();

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

  const loadAppIds = useCallback(async () => {
    const currentAppIds = await GetAppIds();
    const currentAppIdsSorted = currentAppIds
      ? sortStringsAlphabetically(currentAppIds)
      : currentAppIds;
    setAppIds(currentAppIdsSorted);
  }, []);

  useEffect(() => {
    loadKeyPairs();
    loadDomainNames();
    loadAppIds();
  }, [loadKeyPairs, loadDomainNames, loadAppIds]);

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
  ): Promise<UpdateCstgValuesResponse | undefined> => {
    try {
      const response = await UpdateDomainNames(updatedDomainNames);
      let domains = response?.cstgValues;
      const isValidDomains = response?.isValidCstgValues;
      if (!isValidDomains) {
        const invalidDomains = separateStringsList(domains[0]);
        domains = invalidDomains;
      } else {
        setDomainNames(sortStringsAlphabetically(domains));
        SuccessToast(`Domain names ${action}.`);
      }
      const updatedDomainNamesResponse: UpdateCstgValuesResponse = {
        cstgValues: domains,
        isValidCstgValues: isValidDomains,
      };
      return updatedDomainNamesResponse;
    } catch (e) {
      handleErrorToast(e);
    }
  };
  const handleUpdateAppIds = async (updatedAppIds: string[], action: string) => {
    try {
      const response = await UpdateAppIds(updatedAppIds);
      setAppIds(sortStringsAlphabetically(response));
      SuccessToast(`Mobile app ids ${action}.`);
      const updatedAppIdsResponse: UpdateCstgValuesResponse = {
        cstgValues: response,
        isValidCstgValues: true,
      };
      return updatedAppIdsResponse;
    } catch (e) {
      handleErrorToast(e);
    }
  };

  const onAddCstgValues = async (
    newCstgValues: string[],
    deleteExistingList: boolean,
    cstgType: CstgValueType
  ) => {
    let updatedCstgValues = newCstgValues;
    if (cstgType === CstgValueType.MobileAppId && appIds && !deleteExistingList) {
      updatedCstgValues = [...newCstgValues, ...appIds];
      return handleUpdateAppIds(updatedCstgValues, 'added');
    }
    if (cstgType === CstgValueType.Domain && domainNames && !deleteExistingList) {
      updatedCstgValues = [...newCstgValues, ...domainNames];
      return handleUpdateDomainNames(updatedCstgValues, 'added');
    }
  };

  return (
    <>
      <h1>Client-Side Integration</h1>
      <p className='heading-details'>
        View and manage client-side integration key pairs, domain names and mobile app ids.
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
        <CstgTable
          cstgValues={domainNames || []}
          onAddCstgValues={onAddCstgValues}
          onUpdateCstgValues={handleUpdateDomainNames}
          cstgValueType={CstgValueType.Domain}
          addInstructions='Add one or more domains.'
          getUniqueValues={getUniqueDomains}
        />
        <CstgTable
          cstgValues={appIds || []}
          onAddCstgValues={onAddCstgValues}
          onUpdateCstgValues={handleUpdateAppIds}
          cstgValueType={CstgValueType.MobileAppId}
          addInstructions='Please register the Android App ID, iOS/tvOS Bundle ID and iOS App Store ID.'
          getUniqueValues={getUniqueAppIds}
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
