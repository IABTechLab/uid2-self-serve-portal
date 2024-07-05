import { Suspense } from 'react';
import { useRevalidator } from 'react-router-dom';
import { defer, makeLoader, useLoaderData } from 'react-router-typesafe';

import { ClientSideCompletion } from '../components/ClientSideCompletion/ClientSideCompletion';
import {
  CstgValueType,
  UpdateCstgValuesResponse,
} from '../components/ClientSideTokenGeneration/CstgHelper';
import { CstgTable } from '../components/ClientSideTokenGeneration/CstgTable';
import { Loading } from '../components/Core/Loading/Loading';
import { SuccessToast } from '../components/Core/Popups/Toast';
import { ScreenContentContainer } from '../components/Core/ScreenContentContainer/ScreenContentContainer';
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
import { AwaitTypesafe, resolveAll } from '../utils/AwaitTypesafe';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { separateStringsList, sortStringsAlphabetically } from '../utils/textHelpers';
import { PortalRoute } from './routeUtils';

async function getKeyPairs() {
  const keyPairs = await GetKeyPairs();
  return keyPairs.sort((a, b) => a.created.getTime() - b.created.getTime());
}

async function getDomainNames() {
  const currentDomainNames = await GetDomainNames();
  return currentDomainNames ? sortStringsAlphabetically(currentDomainNames) : [];
}

async function getAppIds() {
  const currentAppIds = await GetAppIds();
  return currentAppIds ? sortStringsAlphabetically(currentAppIds) : [];
}

const loader = makeLoader(() => {
  const keyPairs = getKeyPairs();
  const domainNames = getDomainNames();
  const appIds = getAppIds();
  return defer({ keyPairs, domainNames, appIds });
});

function ClientSideIntegration() {
  const data = useLoaderData<typeof loader>();

  const reloader = useRevalidator();

  const handleAddKeyPair = async (formData: AddKeyPairFormProps) => {
    const { name } = formData;
    try {
      const response = await AddKeyPair({ name });
      if (response.status === 201) {
        reloader.revalidate();
        SuccessToast('Key pair added.');
      }
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleUpdateKeyPair = async (formData: UpdateKeyPairFormProps) => {
    const { name, subscriptionId, disabled = false } = formData;
    try {
      await UpdateKeyPair({ name, subscriptionId, disabled });
      reloader.revalidate();
      SuccessToast('Key Pair updated.');
    } catch (e: unknown) {
      handleErrorToast(e);
    }
  };

  const handleDisableKeyPair = async (keyPair: KeyPairModel) => {
    try {
      await DisableKeyPair(keyPair);
      reloader.revalidate();
      SuccessToast('Key pair deleted.');
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
        reloader.revalidate();
        SuccessToast(`Root-Level Domains ${action}.`);
      }
      const updatedDomainNamesResponse: UpdateCstgValuesResponse = {
        cstgValues: sortStringsAlphabetically(domains),
        isValidCstgValues: isValidDomains,
      };
      return updatedDomainNamesResponse;
    } catch (e) {
      handleErrorToast(e);
    }
  };
  const handleUpdateAppIds = async (updatedAppIds: string[], action: string) => {
    try {
      const appIds = await UpdateAppIds(updatedAppIds);
      reloader.revalidate();
      SuccessToast(`Mobile App IDs ${action}.`);

      const updatedAppIdsResponse: UpdateCstgValuesResponse = {
        cstgValues: sortStringsAlphabetically(appIds),
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
    cstgType: CstgValueType,
    existingCstgValues: string[]
  ) => {
    let updatedCstgValues = newCstgValues;
    if (!deleteExistingList) {
      updatedCstgValues = [...newCstgValues, ...existingCstgValues];
    }
    if (cstgType === CstgValueType.MobileAppId) {
      return handleUpdateAppIds(updatedCstgValues, 'added');
    }
    if (cstgType === CstgValueType.Domain) {
      return handleUpdateDomainNames(updatedCstgValues, 'added');
    }
  };

  return (
    <>
      <h1>Client-Side Integration</h1>
      <p className='heading-details'>
        View and manage client-side integration key pairs, domain names, and mobile app IDs. For
        more information, see{' '}
        <a
          className='outside-link'
          target='_blank'
          href='https://unifiedid.com/docs/portal/client-side-integration'
          rel='noreferrer'
        >
          Client-Side Integration
        </a>.
      </p>
      <ScreenContentContainer>
        <Suspense fallback={<Loading message='Loading client side integration data...' />}>
          <AwaitTypesafe
            resolve={resolveAll({
              keyPairs: data.keyPairs,
              domainNames: data.domainNames,
              appIds: data.appIds,
            })}
          >
            {(loadedData) => (
              <>
                <ClientSideCompletion
                  domainNames={loadedData.domainNames}
                  appIds={loadedData.appIds}
                  keyPairData={loadedData.keyPairs}
                />
                <KeyPairsTable
                  keyPairs={loadedData.keyPairs}
                  onAddKeyPair={handleAddKeyPair}
                  onKeyPairEdit={handleUpdateKeyPair}
                  onKeyPairDisable={handleDisableKeyPair}
                />
                <CstgTable
                  cstgValues={loadedData.domainNames || []}
                  onAddCstgValues={onAddCstgValues}
                  onUpdateCstgValues={handleUpdateDomainNames}
                  cstgValueType={CstgValueType.Domain}
                  addInstructions='Add one or more domains.'
                />
                <CstgTable
                  cstgValues={loadedData.appIds || []}
                  onAddCstgValues={onAddCstgValues}
                  onUpdateCstgValues={handleUpdateAppIds}
                  cstgValueType={CstgValueType.MobileAppId}
                  addInstructions='Register the Android App ID, iOS/tvOS Bundle ID, and iOS App Store ID for your apps.'
                />
              </>
            )}
          </AwaitTypesafe>
        </Suspense>
      </ScreenContentContainer>
    </>
  );
}

export const ClientSideIntegrationRoute: PortalRoute = {
  description: 'Client-Side Integration',
  element: <ClientSideIntegration />,
  errorElement: <RouteErrorBoundary />,
  path: '/dashboard/clientSideIntegration',
  loader,
};
